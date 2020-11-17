import * as actionSDK from "@microsoft/m365-action-sdk";
import { ActionHelper, Localizer } from '../common/ActionSdkHelper';

let actionContext = null;
let actionInstance = null;
let actionSummary = null;
let actionDataRows = null;
let actionDataRowsLength = 0;
let ResponderDate = [];
let actionNonResponders = [];
let myUserId = "";
let score = 0;
let total = 0;
let answerIs = "";
let request = new actionSDK.GetContext.Request();
let dataResponse = '';
let actionId = '';

let dueByKey = '';
let expiredOnKey = '';
let correctKey = '';
let incorrectKey = '';
let backKey = '';
let youKey = '';
let questionKey = '';
let scoreKey = '';

/* Initiate Method */
$(document).ready(function() {
    OnPageLoad();
});

/* Calling method  for theme selection based on teams theme */
getTheme(request);

/* Async method for fetching localization strings */
async function getStringKeys() {
    Localizer.getString('dueBy').then(function(result) {
        dueByKey = result;
    });

    Localizer.getString('question').then(function(result) {
        questionKey = result;
    });

    Localizer.getString('score', ':').then(function(result) {
        scoreKey = result;
    });

    Localizer.getString('expired_on').then(function(result) {
        expiredOnKey = result;
    });

    Localizer.getString('correct').then(function(result) {
        correctKey = result;
    });
    Localizer.getString('incorrect').then(function(result) {
        incorrectKey = result;
    });

    Localizer.getString('responders').then(function(result) {
        $('.responder-key').text(result);
    });

    Localizer.getString('non_responders').then(function(result) {
        $('.non-responder-key').text(result);
    });
    Localizer.getString('back').then(function(result) {
        backKey = result;
        $('.back-key').text(backKey);
    });

    Localizer.getString('you').then(function(result) {
        youKey = result;
    });
}

/* 
 * @desc Method to select theme based on the teams theme  
 * @param request context request
 */
async function getTheme(request) {
    dataResponse = await actionSDK.executeApi(request);
    let context = dataResponse.context;
    $("form.section-1").show();
    let theme = context.theme;
    $("link#theme").attr("href", "css/style-" + theme + ".css");
    getStringKeys();

    await actionSDK.executeApi(new actionSDK.HideLoadingIndicator.Request());

}

let root = document.getElementById("root");

/* Method loads the landing page */
function OnPageLoad() {
    actionSDK
        .executeApi(new actionSDK.GetContext.Request())
        .then(function(response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            actionContext = response.context;
            actionId = response.context.actionId;
            getDataRows(response.context.actionId);
        })
        .catch(function(error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        });
}

/* 
 * @desc Method to get data rows  
 * @param request context action id
 */
function getDataRows(actionId) {
    let getActionRequest = new actionSDK.GetAction.Request(actionId);
    let getSummaryRequest = new actionSDK.GetActionDataRowsSummary.Request(
        actionId,
        true
    );
    let getDataRowsRequest = new actionSDK.GetActionDataRows.Request(actionId);
    let batchRequest = new actionSDK.BaseApi.BatchRequest([
        getActionRequest,
        getSummaryRequest,
        getDataRowsRequest,
    ]);

    actionSDK
        .executeBatchApi(batchRequest)
        .then(function(batchResponse) {
            console.info("BatchResponse: " + JSON.stringify(batchResponse));
            actionInstance = batchResponse.responses[0].action;
            actionSummary = batchResponse.responses[1].summary;
            actionDataRows = batchResponse.responses[2].dataRows;
            actionDataRowsLength = actionDataRows == null ? 0 : actionDataRows.length;
            createBody();
        })
        .catch(function(error) {
            console.error("Console log: Error: " + JSON.stringify(error));
        });
}

/* Method for creating the response view structure and initialize value */
async function createBody() {
    let getSubscriptionCount = "";
    $("#root").html("");

    console.log('actionInstance: ' + JSON.stringify(actionInstance));
    /*  Head Section  */
    head();

    /*  Person Responded X of Y Responses  */
    getSubscriptionCount = new actionSDK.GetSubscriptionMemberCount.Request(
        actionContext.subscription
    );
    let response = await actionSDK.executeApi(getSubscriptionCount);

    let $pcard = $('<div class="progress-section"></div>');

    let memberCount = response.memberCount;
    let participationPercentage = 0;

    participationPercentage = Math.round(
        (actionSummary.rowCreatorCount / memberCount) * 100
    );
    Localizer.getString('participation', participationPercentage).then(function(result) {
        $pcard.append(
            `<label class="mb--8"><strong classs="semi-bold">${result}</strong></label><div class="progress mb--8"><div class="progress-bar bg-primary" role="progressbar" style="width: ${participationPercentage}%" aria-valuenow="${participationPercentage}" aria-valuemin="0" aria-valuemax="100"></div></div>`
        );
    });
    Localizer.getString('xofy_people_responded', actionSummary.rowCount, memberCount).then(function(result) {
        let xofy = result;
        $pcard.append(`<p class="date-color cursor-pointer under-line mb--24" id="show-responders">${xofy}</p>`);
        $pcard.append(`<div class="clearfix"></div>`);
    });

    $("#root").append($pcard);
    await getUserprofile();

    if (Object.keys(ResponderDate).length > 0) {
        if (myUserId == dataResponse.context.userId && myUserId == actionInstance.creatorId) {
            console.log('createCreatorQuestionView:');
            createCreatorQuestionView();
        } else if (myUserId != actionInstance.creatorId) {
            /* if (myUserId == dataResponse.context.userId) {
                console.log('createQuestionView:');
                createQuestionView(myUserId);
            } else { */
            console.log('yet to respond:');

            ResponderDate.forEach((responders) => {
                let name = responders.label;
                let matches = name.match(/\b(\w)/g); // [D,P,R]
                let initials = matches.join('').substring(0, 2); // DPR
                Localizer.getString('you_yet_respond').then(function(result) {

                    $('div.progress-section').after(`<div class="d-flex cursor-pointer getresult" id="${responders.value2}">
                                <div class="avtar">
                                    ${initials}
                                </div>
                                <div class="avtar-txt">${result}</div>
                            </div>
                        `);
                    $('div.progress-section').after(`<hr class="small">`);
                });
            });
            // }
        } else {
            ResponderDate.forEach((responder) => {
                if (responder.value2 == myUserId) {
                    console.log('createReponderQuestionView2:');
                    createReponderQuestionView(myUserId, responder);
                }
            });
        }
    } else {
        actionNonResponders.forEach((nonresponders) => {
            if (nonresponders.value2 == myUserId) {
                if (dataResponse.context.userId == myUserId) {
                    console.log('createCreatorQuestionView2:');
                    createCreatorQuestionView();
                } else {
                    console.log('yet to respond2:');

                    let name = nonresponders.label;
                    let matches = name.match(/\b(\w)/g); // [D,P,R]
                    let initials = matches.join('').substring(0, 2); // DPR
                    Localizer.getString('you_yet_respond').then(function(result) {
                        $('div.progress-section').after(`<hr class="small">`);
                        $('div.progress-section').after(`<div class="d-flex cursor-pointer getresult" id="${nonresponders.value2}">
                                <div class="avtar">
                                    ${initials}
                                </div>
                                <div class="avtar-txt">${result}</div>
                            </div>
                        `);
                    });
                    $('div.progress-section').after(`<hr class="small">`);
                }
            }
        })
    }

    return true;
}

/* Method for creating head section for title, progress bar, dueby */
function head() {
    let title = actionInstance.displayName;
    let description = actionInstance.customProperties[0]["value"];
    let dueby = new Date(actionInstance.expiryTime).toDateString();

    let $card = $('<div class=""></div>');
    let $title_sec = $(`<h4 class="mb---8">${title}</h4>`);
    let $description_sec = $(`<p class="mb--8 text-justify text-break">${description}</p>`);

    let current_timestamp = new Date().getTime();

    let $date_sec = $(`<p class="semi-bold mb--16">${actionInstance.expiryTime > current_timestamp ? dueByKey+' ' : expiredOnKey+' '} ${dueby}</p>`);

    $card.append($title_sec);
    $card.append($description_sec);
    $card.append($date_sec);
    $("#root").append($card);
}

/* Method for fetch responder user details */
async function getUserprofile() {
    let memberIds = [];
    ResponderDate = [];
    actionNonResponders = [];
    if (actionDataRowsLength > 0) {
        for (let i = 0; i < actionDataRowsLength; i++) {
            memberIds.push(actionDataRows[i].creatorId);
            let requestResponders = new actionSDK.GetSubscriptionMembers.Request(
                actionContext.subscription, [actionDataRows[i].creatorId]
            ); // ids of responders

            let responseResponders = await actionSDK.executeApi(requestResponders);
            let perUserProfile = responseResponders.members;
            ResponderDate.push({
                label: perUserProfile[0].displayName,
                value: new Date(actionDataRows[i].updateTime).toDateString(),
                value2: perUserProfile[0].id,
            });
        }
    }

    myUserId = actionContext.userId;
    let requestNonResponders = new actionSDK.GetActionSubscriptionNonParticipants.Request(
        actionContext.actionId,
        actionContext.subscription.id
    );
    let responseNonResponders = await actionSDK.executeApi(requestNonResponders);
    let tempresponse = responseNonResponders.nonParticipants;
    if (tempresponse != null) {
        for (let i = 0; i < tempresponse.length; i++) {
            actionNonResponders.push({
                label: tempresponse[i].displayName,
                value2: tempresponse[i].id,
            });
        }
    }
}

/* Method for fetch list of responders */
function getResponders() {
    $("table#responder-table tbody").html("");

    for (let itr = 0; itr < ResponderDate.length; itr++) {
        let id = ResponderDate[itr].value2;
        let name = "";
        if (ResponderDate[itr].value2 == myUserId) {
            name = youKey;
        } else {
            name = ResponderDate[itr].label;
        }
        let date = ResponderDate[itr].value;

        let matches = ResponderDate[itr].label.match(/\b(\w)/g); // [D,P,R]
        let initials = matches.join('').substring(0, 2); // DPR

        let score = scoreCalculate(ResponderDate[itr].value2);

        $(".tabs-content:first")
            .find("table#responder-table tbody")
            .append(
                `<tr id="${ResponderDate[itr].value2}" class="getresult cursor-pointer">
                    <td>
                        <div class="d-flex ">
                            <div class="avtar">
                                ${initials}
                            </div>
                            <div class="avtar-txt">${name}</div>
                        </div>
                    </td>
                    <td  class="text-right">
                        ${date}
                        <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="right-carate">
                            <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                            </path>
                            <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                            </path>
                        </svg>
                        <p class="semi-bold pr--8">${scoreKey} ${score}%</p>
                    </td>
                </tr>`
            );
    }
}

/**
 * @description Calculate the score
 * @param userId String Identifier
 */

function scoreCalculate(userId) {
    let total = 0;
    let score = 0;
    actionInstance.dataTables.forEach((dataTable) => {
        total = Object.keys(dataTable.dataColumns).length;

        dataTable.dataColumns.forEach((question, ind) => {
            question.options.forEach((option) => {
                /* User Responded */
                for (let i = 0; i < actionDataRowsLength; i++) {
                    if (actionDataRows[i].creatorId == userId) {
                        let userResponse = actionDataRows[i].columnValues;
                        let userResponseLength = Object.keys(userResponse).length;

                        let userResponseAnswer = [];
                        for (let j = 1; j <= userResponseLength; j++) {
                            if (isJson(userResponse[j])) {
                                let userResponseAns = JSON.parse(userResponse[j]);
                                let userResponseAnsLen = userResponseAns.length;
                                if (userResponseAnsLen > 1) {
                                    for (let k = 0; k < userResponseAnsLen; k++) {
                                        if (userResponseAns[k] == option.name) {
                                            userResponseAnswer = userResponseAns[k];
                                        } else {
                                            continue;
                                        }
                                    }
                                } else {
                                    userResponseAnswer = userResponseAns;
                                }
                            } else {
                                if (userResponse[j] == option.name) {
                                    userResponseAnswer = userResponse[j];
                                }
                            }
                        }
                    }
                }

                /* Correct Answer */
                let correctResponse = JSON.parse(
                    actionInstance.customProperties[5].value
                );
                let correctResponseLength = Object.keys(correctResponse).length;
                let correctAnswer = "";
                for (let j = 0; j < correctResponseLength; j++) {
                    let correctResponseAns = correctResponse[j];
                    let correctResponseAnsLen = correctResponseAns.length;
                    for (let k = 0; k < correctResponseAnsLen; k++) {
                        if (correctResponseAns[k] == option.name) {
                            correctAnswer = correctResponseAns[k];
                        }
                    }
                }
            });
            if (answerIs == "Correct") {
                score++;
            }
        });
    });
    return Math.round((score / total) * 100);
}

/* Method for fetch list of non-responders in the channel */
function getNonresponders() {
    $("table#non-responder-table tbody").html("");

    for (let itr = 0; itr < actionNonResponders.length; itr++) {
        let id = actionNonResponders[itr].value2;
        let name = "";
        if (actionNonResponders[itr].value2 == myUserId) {
            name = "You";
        } else {
            name = actionNonResponders[itr].label;
        }
        let matches = actionNonResponders[itr].label.match(/\b(\w)/g); // [D,P,R]
        let initials = matches.join('').substring(0, 2); // DPR

        let date = actionNonResponders[itr].value;
        $(".tabs-content:first")
            .find("table#non-responder-table tbody")
            .append(`<tr>
                <td>
                    <div class="d-flex">
                        <div class="avtar">
                            ${initials}
                        </div>
                        <div class="avtar-txt">${name}</div>
                    </div>
                </td>
            </tr>`);
    }
}

/* Click evet fetching result of responders */
$(document).on("click", ".getresult", function() {
    let userId = $(this).attr("id");
    $("#root").html("");
    head();
    $("#root").append($(".question-content").clone());
    createQuestionView(userId);

    if ($(this).attr('data-attr') !== undefined) {
        footer2();
    } else {
        footer(userId);
    }
});

/* 
 * @desc Method to creat4e responder correct and incorrect quiz responses  
 * @param userId contains user id for identifications
 * @param responder contains responders
 */
function createReponderQuestionView(userId, responder = '') {
    total = 0;
    score = 0;
    $("div#root > div.question-content").html("");

    if (responder != '') {
        let name = responder.label;
        let matches = name.match(/\b(\w)/g); // [D,P,R]
        let initials = matches.join('').substring(0, 2); // DPR
        $('div.progress-section').after(`<hr class="small">`);

        Localizer.getString('you_responded').then(function(result) {
            $('div.progress-section').after(`<div class="d-flex cursor-pointer getresult" data-attr="home" id="${myUserId}">
                    <div class="avtar">
                        ${initials}
                    </div>
                    <div class="avtar-txt">${result}</div>
                </div>
                <hr class="small">`);
            $('div.progress-section').after(`<hr class="small">`);
        });
    }

    actionInstance.dataTables.forEach((dataTable) => {
        total = Object.keys(dataTable.dataColumns).length;

        dataTable.dataColumns.forEach((question, ind) => {
            answerIs = "";
            let $cardDiv = $('<div class="card-box card-bg card-border alert-success mb--8"></div>');
            let $questionContentDiv = $('<div class="question-content"></div>');
            let $rowdDiv = $('<div class="mt--32"></div>');
            let $dflexDiv = $('<div class="d-table mb--4"></div>');
            // let $qDiv = $('<div class="col-sm-12"></div>');
            $questionContentDiv.append($rowdDiv);
            $questionContentDiv.append($dflexDiv);
            let count = ind + 1;
            let $questionHeading = $(`<label class="font-12"></label>`);
            $questionHeading.append(
                `<strong class="question-title semi-bold"><span  class="question-number ">Question # ${count}</span></strong></label> </strong>`
            );
            $questionHeading.append(`<label class="float-right" id="status-1 "></label>`);

            $dflexDiv.append($questionHeading);

            $dflexDiv.append(`<div class=" ">
                    <div class="semi-bold font-14 mb--16 ">${JSON.parse(question.displayName).name}</div>
                </div>`);

            let optAnsArr = [];
            question.options.forEach((option, optind) => {
                /* User Responded */
                let userResponse = [];
                let userResponseAnswer = "";
                console.log('actionDataRows1: ');
                console.log(actionDataRows);
                for (let i = 0; i < actionDataRowsLength; i++) {
                    if (actionDataRows[i].creatorId == userId) {
                        userResponse = actionDataRows[i].columnValues;
                        let userResponseLength = Object.keys(userResponse).length;

                        for (let j = 1; j <= userResponseLength; j++) {
                            if (isJson(userResponse[j])) {
                                let userResponseAns = JSON.parse(userResponse[j]);
                                let userResponseAnsLen = userResponseAns.length;
                                if (userResponseAnsLen > 1) {
                                    for (let k = 0; k < userResponseAnsLen; k++) {
                                        if (userResponseAns[k] == option.name) {
                                            userResponseAnswer = userResponseAns[k];
                                        } else {
                                            continue;
                                        }
                                    }
                                } else {
                                    userResponseAnswer = userResponseAns;
                                }
                            } else {
                                if (userResponse[j] == option.name) {
                                    userResponseAnswer = userResponse[j];
                                }
                            }
                        }
                    }
                }

                /* Correct Answer */
                let correctResponse = JSON.parse(
                    actionInstance.customProperties[5].value
                );
                let correctResponseLength = Object.keys(correctResponse).length;
                let correctAnswer = "";
                for (let j = 0; j < correctResponseLength; j++) {
                    let correctResponseAns = correctResponse[j];
                    let correctResponseAnsLen = correctResponseAns.length;
                    for (let k = 0; k < correctResponseAnsLen; k++) {
                        if (correctResponseAns[k] == option.name) {
                            correctAnswer = correctResponseAns[k];
                        }
                    }
                }

                let optName = JSON.parse(option.displayName).name
                let $radioOption = getOptions(
                    optName,
                    question.name,
                    option.name,
                    userResponseAnswer,
                    correctAnswer
                );
                $cardDiv.append($radioOption);

                if (answerIs == 'correct') {
                    optAnsArr[optind] = answerIs;
                } else {
                    optAnsArr[optind] = 'incorrect';
                }
            });
            $cardDiv.find("#status-" + question.name).html(`<span class="${answerIs == 'Correct' ? 'text-success' : 'text-danger'}">${answerIs == 'Correct' ? correctKey : incorrectKey}</span>`);

            /* if (answerIs == "Correct") {
                score++;
            } */
            console.log('optAnsArr: ');
            console.log(optAnsArr);
            if (optAnsArr.includes('incorrect') != false) {
                score++;
            }
            $("#root").append($cardDiv);
        });
    });
    $("#root").append('<div class="ht-100"></div>');
    let scorePercentage = Math.round((score / total) * 100);

    Localizer.getString("score", ":").then(function(result) {
        $("#root > hr.small:last").after(`<div class="d-flex"><p class="semi-bold font-14">${result} ${scorePercentage}%</p></div>`);
    });
}

/* 
 * @desc Method to create responder correct and incorrect quiz responses  
 */
function createCreatorQuestionView() {
    total = 0;
    let count = 1;
    score = 0;

    $("div#root > div.question-content").html("");

    Localizer.getString('aggregrateResult').then(function(result) {
        $('div.progress-section').after(`
            <div class="clearfix"></div>
            <hr class="small">
            <div class="d-flex cursor-pointer" data-attr="home" id="${myUserId}">
                    <p class="semi-bold font-14">${result}</p>
            </div>
            <hr class="small">
        `);

        console.log(result);
    });

    actionInstance.dataTables.forEach((dataTable) => {
        dataTable.dataColumns.forEach((question, ind) => {
            let correctCounter = 0;
            answerIs = "";
            let $quesContDiv = $(`<div class="question-content"></div>`);
            let $mtDiv = $(`<div class="mt--32"></div>`);
            let $dflexDiv = $('<div class="d-table mb--4"></div>');

            $quesContDiv.append($mtDiv);
            $('#root').append($quesContDiv);
            let count = ind + 1;
            let attachmentId = JSON.parse(question.displayName).attachmentId;

            $dflexDiv.append(`<label class="font-12 ">
                    <strong class="question-title semi-bold "> 
                        <span  class="question-number ">${questionKey} # ${count}</span>
                    </strong>
                </label>`);
            $dflexDiv.append(`<label class="float-right " id="status-${question.name}"> </label>`);
            $mtDiv.append($dflexDiv);
            let $blankQDiv = $(`<div class=""></div>`);
            // $mtDiv.append(`<div class="semi-bold font-14 mb--16 ">${JSON.parse(question.displayName).name}</div>`);
            $mtDiv.append($blankQDiv);
            $blankQDiv.append(`
                    <div class="semi-bold font-14 mb--16 ">${JSON.parse(question.displayName).name}</div>
            `);


            if (attachmentId.length > 0) {
                console.log('actionInstance:' + JSON.stringify(actionId));
                let req = ActionHelper.getAttachmentInfo("", attachmentId);
                ActionHelper.executeApi(req).then(function(response) {
                        console.info("Attachment - Response: " + JSON.stringify(response));
                        $mtDiv.find('d-table').after(`
                            <div class="quiz-updated-img cover-img max-min-220 mb--8">
                                <img src="${response.attachmentInfo.downloadUrl}" class="image-responsive question-template-image">
                            </div>`);
                    })
                    .catch(function(error) {
                        console.error("AttachmentAction - Error: " + JSON.stringify(error));
                    });
            }
            let correctAnswerCounter = 0;
            let resResult = [];
            question.options.forEach((option, iii) => {
                /* User Responded */
                let $cardDiv = $('<div class="card-box card-bg card-border mb--8 "></div>');
                let userResponse = [];
                let userResponseAnswer = "";
                console.log('actionDataRows2: ');
                console.log(actionDataRows);
                for (let i = 0; i < actionDataRowsLength; i++) {
                    userResponse = actionDataRows[i].columnValues;
                    let userResponseLength = Object.keys(userResponse).length;

                    for (let j = 1; j <= userResponseLength; j++) {
                        if (isJson(userResponse[j])) {
                            let userResponseAns = JSON.parse(userResponse[j]);
                            let userResponseAnsLen = userResponseAns.length;
                            if (userResponseAnsLen > 1) {
                                for (let k = 0; k < userResponseAnsLen; k++) {
                                    if (userResponseAns[k] == option.name) {
                                        userResponseAnswer = userResponseAns[k];
                                    } else {
                                        continue;
                                    }
                                }
                            } else {
                                userResponseAnswer = userResponseAns;
                            }
                        } else {
                            if (userResponse[j] == option.name) {
                                userResponseAnswer = userResponse[j];
                            }
                        }
                    }
                }

                /* Correct Answer */
                let correctResponse = JSON.parse(
                    actionInstance.customProperties[5].value
                );
                let correctResponseLength = Object.keys(correctResponse).length;
                let correctAnswer = "";
                for (let j = 0; j < correctResponseLength; j++) {
                    let correctResponseAns = correctResponse[j];
                    console.log('correctResponseAns: ' + JSON.stringify(correctResponseAns));

                    let correctResponseAnsLen = correctResponseAns.length;

                    for (let k = 0; k < correctResponseAnsLen; k++) {
                        console.log(`${correctResponseAns[k]} == ${option.name}`)
                        if (correctResponseAns[k] == option.name) {
                            correctAnswer = correctResponseAns[k];
                            correctAnswerCounter++;
                        }
                    }
                }

                console.log(`${correctAnswer} == ${userResponseAnswer}`);
                resResult[iii] = 'false';

                if (correctAnswer.length > 0 && userResponseAnswer.length > 0 && correctAnswer == userResponseAnswer) {
                    console.log(`sadasd:`);
                    console.log(`${correctResponseLength} == ${correctAnswerCounter}`);
                    if (correctResponseLength == correctAnswerCounter) {
                        resResult[iii] = 'true';
                    } else {
                        resResult[iii] = 'false';
                    }
                }

                let optName = JSON.parse(option.displayName).name;
                let attachmentId = JSON.parse(option.displayName).attachmentId;
                let optId = option.name;

                let correctAnswerData = JSON.parse(actionInstance.customProperties[5].value);
                // let anscorr = [];
                /* if (correctAnswerData != undefined) {
                    console.log('correctAnswerData: ' + correctAnswerData);
                    console.log('correctAnswerData: ' + correctAnswerData[0]);
                    if (correctAnswerData.indexOf(',') > -1) {
                        anscorr = correctAnswerData.split(',');
                        console.log('anscorr if: ' + anscorr);
                    } else {
                        anscorr.push(correctAnswerData);
                        console.log('anscorr else: ' + anscorr);
                    }
                } */
                console.log(`${correctAnswerData}.includes(${optId})`)
                console.log(correctAnswerData.includes(optId))

                let $radioOption = '';
                let result = '';
                for (let j = 0; j < correctResponseLength; j++) {
                    let correctResponseAns = correctResponse[j];
                    if (correctResponseAns.includes(option.name)) {
                        result = 'correct';
                    }
                }
                $radioOption = getOptionsCreator(optName, optId, ind, result, attachmentId);

                $cardDiv.append($radioOption);
                if (result == 'correct')
                    $cardDiv.addClass("alert-success");

                $quesContDiv.append($cardDiv);
            });

            console.log('resResult: ');
            console.log(resResult);
            if (resResult.includes('false') == false) {
                correctCounter++;
            }

            if (actionDataRowsLength == 0) {
                $dflexDiv.find("#status-" + question.name).html(`<span class="semi-bold">0% Correct</div>`);
            } else {
                console.log(actionDataRows);
                console.log(`${(correctCounter * 100)} / ${actionDataRowsLength}% Correct`);
                $dflexDiv.find("#status-" + question.name).html(`<span class="semi-bold">${(correctCounter * 100) / actionDataRowsLength}% Correct</span>`);
            }
        });
    });
    // $("#root").append('<div class="ht-100"></div>');
}

/* 
 * @desc Method for Question view based on user id  
 * @param user id String contains userId
 */
function createQuestionView(userId) {
    total = 0;
    score = 0;
    $("div#root > div.question-content").html("");

    actionInstance.dataTables.forEach((dataTable) => {
        total = Object.keys(dataTable.dataColumns).length;
        dataTable.dataColumns.forEach((question, ind) => {
            answerIs = "";
            let $questionDiv = $(`<div class="question-content"></div>`);
            let $mtDiv = $(`<div class="mt--32"></div>`);
            let $dtableDiv = $(`<div class="d-table mb--4 "></div>`);
            let count = ind + 1;
            let attachmentId = JSON.parse(question.displayName).attachmentId;

            $questionDiv.append($mtDiv);
            $mtDiv.append($dtableDiv);
            $dtableDiv.append(`<label class="font-12">
                    <strong class="question-title semi-bold"> 
                        <span  class="question-number">${questionKey} # ${count}</span>
                    </strong>
                </label>`);

            $dtableDiv.append(`<label class="float-right" id="status-${question.name} "></label>`);

            let $blankQDiv = $(`<div class=""></div>`);
            $mtDiv.append($blankQDiv);
            $blankQDiv.append(`
                    <div class="semi-bold font-14 mb--16 ">${JSON.parse(question.displayName).name}</div>
            `);


            console.log('attachmentId: ' + attachmentId);
            if (attachmentId.length > 0) {
                console.log('actionInstance:' + JSON.stringify(actionId));
                let req = ActionHelper.getAttachmentInfo("", attachmentId);
                ActionHelper.executeApi(req).then(function(response) {
                        console.info("Attachment - Response: " + JSON.stringify(response));
                        // $dtableDiv.append();
                        $mtDiv.find('d-table').after(`
                            <div class="quiz-updated-img cover-img max-min-220 mb--8">
                                <img src="${response.attachmentInfo.downloadUrl}" class="image-responsive question-template-image">
                            </div>`);
                    })
                    .catch(function(error) {
                        console.error("AttachmentAction - Error: " + JSON.stringify(error));
                    });
            }

            let $blankDiv = $(`<div class=" "></div>`);
            $mtDiv.append($blankDiv);
            let optAnsArr = [];
            question.options.forEach((option, optind) => {
                /* User Responded */
                let userResponse = [];
                let userResponseAnswer = "";

                for (let i = 0; i < actionDataRowsLength; i++) {
                    if (actionDataRows[i].creatorId == userId) {
                        userResponse = actionDataRows[i].columnValues;
                        let userResponseLength = Object.keys(userResponse).length;

                        for (let j = 1; j <= userResponseLength; j++) {
                            if (isJson(userResponse[j])) {
                                let userResponseAns = JSON.parse(userResponse[j]);
                                let userResponseAnsLen = userResponseAns.length;
                                if (userResponseAnsLen > 1) {
                                    for (let k = 0; k < userResponseAnsLen; k++) {
                                        if (userResponseAns[k] == option.name) {
                                            userResponseAnswer = userResponseAns[k];
                                        } else {
                                            continue;
                                        }
                                    }
                                } else {
                                    userResponseAnswer = userResponseAns;
                                }
                            } else {
                                if (userResponse[j] == option.name) {
                                    userResponseAnswer = userResponse[j];
                                }
                            }
                        }
                    }
                }
                /* Correct Answer */
                let correctResponse = JSON.parse(
                    actionInstance.customProperties[5].value
                );
                let correctResponseLength = Object.keys(correctResponse).length;
                let correctAnswer = "";
                for (let j = 0; j < correctResponseLength; j++) {
                    let correctResponseAns = correctResponse[j];
                    let correctResponseAnsLen = correctResponseAns.length;
                    for (let k = 0; k < correctResponseAnsLen; k++) {
                        if (correctResponseAns[k] == option.name) {
                            correctAnswer = correctResponseAns[k];
                        }
                    }
                }

                let optName = JSON.parse(option.displayName).name
                let optAttachmentId = JSON.parse(option.displayName).attachmentId

                let $radioOption = getOptions(
                    optName,
                    question.name,
                    option.name,
                    userResponseAnswer,
                    correctAnswer,
                    optAttachmentId
                );
                $blankDiv.append($radioOption);

                if (answerIs == 'correct') {
                    optAnsArr[optind] = answerIs;
                } else {
                    optAnsArr[optind] = 'incorrect';
                }
                $questionDiv.find("#status-" + question.name).html(`<span class="semi-bold ${answerIs == 'Correct' ? 'text-success' : 'text-danger'}">${answerIs}</span>`);
            });

            /* if (answerIs == "Correct") {
                score++;
            } */
            console.log('optAnsArr: ' + optAnsArr);
            if (optAnsArr.includes('incorrect') != true) {
                score++;
            }
            $("div.question-content:first").append($questionDiv);
        });

    });
    // $("div.question-content:first").append('<div class="ht-100"></div>');

    let scorePercentage = Math.round((score / total) * 100);

    Localizer.getString("score", ":").then(function(result) {
        $("#root > div:first").after(`<div class="d-flex"><p class="semi-bold pr--8">${result} ${scorePercentage}%</p></div>`);
    });
}

/**
 * @desc Method for Question view based on user id  
 * @param text String contains correct and incorrect message
 * @param name String contains option name
 * @param id String contains option id
 * @param userResponse String contains user response data
 * @param correctAnswer String contains correct answer 
 * @param attachmentId String contains attachment id of option 
 */
function getOptions(text, name, id, userResponse, correctAnswer, attachmentId) {
    let $oDiv = $('<div class=""></div>');
    /*  If answer is correct  and answered */
    if ($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) == $.trim(id)) {
        console.log(` asdasdsa1: ${$.trim(userResponse)}, ${$.trim(id)}, ${$.trim(correctAnswer)}`);
        $oDiv.append(
            `<div class="card-box card-bg card-border alert-success mb--8">
                <div class="radio-section custom-radio-outer" id="${id} " columnid="3 ">
                    <label class="custom-radio d-block font-14">
                        <span class="radio-block selected "></span>
                        <div class="pr--32 ">${text} </div>
                    </label>
                </div>
                <i class="success-with-img"> 
                    <svg version="1.1 " id="Layer_1 "  x="0px " y="0px" width="16px " height="16px " viewBox="0 0 16 16 "  xml:space="preserve ">
                        <rect x="22.695 " y="-6 " fill="none " width="16 " height="16 "/>
                        <path id="Path_594 "  d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z "/>
                    </svg> 
                </i> 
            </div>`
        );
        if (answerIs == "") {
            answerIs = "Correct";
        }
    } else if (($.trim(userResponse) != $.trim(id) && $.trim(correctAnswer) == $.trim(id))) {
        console.log(` asdasdsa2: ${$.trim(userResponse)}, ${$.trim(id)}, ${$.trim(correctAnswer)}`);
        /* If User Response is incorrect and not answered */
        $oDiv.append(`<div class="card-box card-bg card-border mb--8 alert-success">
                <div class="radio-section custom-radio-outer" id="${id}">
                    <label class="custom-radio d-block selected font-14  "> 
                        <span class="radio-block"></span>${text} 
                    </label>
                </div>
                <i class="success-with-img"> 
                    <svg version="1.1 " id="Layer_1 "  x="0px " y="0px" width="16px " height="16px " viewBox="0 0 16 16 "  xml:space="preserve ">
                        <rect x="22.695 " y="-6 " fill="none " width="16 " height="16 "/>
                        <path id="Path_594 "  d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z "/>
                    </svg> 
                </i> 
            </div>`);
    } else if (($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) != $.trim(id))) {
        console.log(` asdasdsa3: ${$.trim(userResponse)}, ${$.trim(id)}, ${$.trim(correctAnswer)}`);
        /* If User Response is correct and answered incorrect */
        $oDiv.append(`<div class="card-box card-bg card-border alert-danger mb--8">
                <div class="radio-section custom-radio-outer" id="${id}">
                    <label class="custom-radio d-block selected font-14  "> 
                        <span class="radio-block selected"></span>${text} 
                    </label>
                </div>
            </div>`);
    } else {
        console.log(` asdasdsa4: ${$.trim(userResponse)}, ${$.trim(id)}, ${$.trim(correctAnswer)}`);
        $oDiv.append(`<div class="card-box card-bg card-border mb--8 ">
                <div class=" radio-section custom-radio-outer " id="${id}" columnid="3 ">
                    <label class="custom-radio d-block font-14"> 
                        <span class="radio-block"></span>${text} 
                    </label>
                </div>
            </div>`);
    }

    if (attachmentId.length > 0) {
        let req = ActionHelper.getAttachmentInfo("", attachmentId);
        ActionHelper.executeApi(req).then(function(response) {
                console.info("Attachment - Response: " + JSON.stringify(response));
                $oDiv.find('label.custom-radio').prepend(`
                    <div class="option-image-section cover-img max-min-220 mb--8"> 
                        <img src="${response.attachmentInfo.downloadUrl} " class="opt-image img-responsive">
                    </div>`);
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error: " + JSON.stringify(error));
            });
    }
    return $oDiv;
}

/* 
 * @desc Method for Question view based on user id  
 * @param text String contains correct and incorrect message
 * @param name String contains option name
 * @param id String contains option id
 * @param userResponse String contains user response data
 * @param correctAnswer String contains correct answer 
 * @param attachmentId String contains attachment id of option 
 */
function getOptionsCreator(text, optId, ind, result, attachmentId) {
    let $oDiv = $('<div class="form-group"></div>');
    /*  If answer is correct  and answered */
    if (result == 'correct') {
        $oDiv.append(`
                <div class="radio-section custom-radio-outer " id="${optId}" columnid="${ind}">
                    <label class="custom-radio d-block font-14 cursor-pointer ">
                        <span class="radio-block"></span>
                        <div class="pr--32 ">${text}</div>
                    </label>
                </div>
                <i class="success"> 
                    <svg version="1.1 " id="Layer_1"  x="0px" y="0px" width="16px " height="16px " viewBox="0 0 16 16 "  xml:space="preserve ">
                    <rect x="22.695 " y="-6 " fill="none " width="16 " height="16 "/>
                    <path id="Path_594 "  d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005
                            c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z "/>
                    </svg> 
                </i>
            `);
    } else {
        $oDiv.append(`
                <div class="radio-section custom-radio-outer " id="${optId}" columnid="${ind}">
                    <label class="custom-radio d-block font-14 cursor-pointer ">
                        <span class="radio-block"></span>
                        <div class="pr--32 ">${text}</div>
                    </label>
                </div>
            `);
    }
    if (attachmentId.length > 0) {
        let req = ActionHelper.getAttachmentInfo("", attachmentId);
        ActionHelper.executeApi(req).then(function(response) {
                console.info("Attachment - Response: " + JSON.stringify(response));
                $oDiv.find('label.custom-radio').prepend(`
                    <div class="option-image-section cover-img max-min-220 mb--8"> 
                        <img src="${response.attachmentInfo.downloadUrl} " class="opt-image img-responsive">
                    </div>`);
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error: " + JSON.stringify(error));
            });
    }
    return $oDiv;
}


/* 
 * @desc Method to return the input is json object   
 * @param str object contains json values
 */
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/* 
 * @desc Method for creating footer based on user id  
 * @param userId String contains user identifier to load footer based on that
 */
function footer(userId) {
    $("div.question-content").append(`
        <div class="footer">
            <div class="footer-padd bt">
                <div class="container">
                    <div class="row">
                        <div class="col-9">
                            <a class="cursor-pointer back1" userid-data="${userId}" id="hide2">
                                <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="back-btn">
                                    <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                    </path>
                                    <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                    </path>
                                </svg> <span class="back-key">${backKey}</span>
                            </a>
                        </div>
                        <div class="col-3"><button class="btn btn-tpt">&nbsp;</button></div>
                    </div>
                </div>
            </div>
        </div>`);
}

/* Method for footer for return back to landing page  */
function footer1() {
    $("#root > div.card-box").append(
        `<div class="footer">
            <div class="footer-padd bt">
                <div class="container">
                    <div class="row">
                        <div class="col-9">
                            <a class="cursor-pointer back" id="hide2">
                                <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="back-btn">
                                    <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                    </path>
                                    <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                    </path>
                                </svg> <span class="back-key">${backKey}</span>
                            </a>
                        </div>
                        <div class="col-3"><button class="btn btn-tpt">&nbsp;</button></div>
                    </div>
                </div>
            </div>
        </div>`
    );
}

/* Method for footer for return back for internal pages  */
function footer2() {
    $("div.question-content").append(
        `<div class="footer">
            <div class="footer-padd bt">
                <div class="container">
                    <div class="row">
                        <div class="col-9">
                            <a class="cursor-pointer back" id="hide2">
                                <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="back-btn">
                                    <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                    </path>
                                    <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                    </path>
                                </svg> <span class="back-key">${backKey}</span>
                            </a>
                        </div>
                        <div class="col-3"><button class="btn btn-tpt">&nbsp;</button></div>
                    </div>
                </div>
            </div>
        </div>`
    );
}

/* Click Event for rerender the landing page  */
$(document).on("click", ".back", function() {
    createBody();
});

/* Click Event for back to responder and non responder page */
$(document).on("click", ".back1", function() {
    let userId = $(this).attr("userid-data");
    create_responder_nonresponders();
});

/* Click Event for responder page */
$(document).on("click", "#show-responders", function() {
    create_responder_nonresponders();
});

/* Click Event for non responder page */
function create_responder_nonresponders() {
    if (actionInstance.customProperties[2].value == "Only me") {
        if (actionContext.userId == actionInstance.creatorId) {
            $("#root").html("");
            if ($(".tabs-content:visible").length <= 0) {
                let $card1 = $('<div class="card-box card-blank"></div>');
                let tabs = $(".tabs-content").clone();
                $card1.append(tabs.clone());
                $("#root").append($card1);
                footer1();
            }

            /*  Add Responders  */
            getResponders();

            /*  Add Non-reponders  */
            getNonresponders();
        } else {
            // alert("Visible to sender only");
            return false;
        }
    } else {
        $("#root").html("");
        if ($(".tabs-content:visible").length <= 0) {
            let $card1 = $('<div class="card-box card-blank"></div>');
            let tabs = $(".tabs-content").clone();
            $card1.append(tabs.clone());
            $("#root").append($card1);
            footer1();
        }

        // Add Responders
        getResponders();

        // Add Non-reponders
        getNonresponders();
    }
}
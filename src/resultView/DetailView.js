import * as actionSDK from "@microsoft/m365-action-sdk";
import { Localizer } from '../common/ActionSdkHelper';

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
let answer_is = "";
let request = new actionSDK.GetContext.Request();

let dueByKey = '';
let expiredOnKey = '';
let correctKey = '';
let incorrectKey = '';
let backKey = '';
let youKey = '';

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
    let response = await actionSDK.executeApi(request);
    let context = response.context;
    $("form.section-1").show();
    var theme = context.theme;
    $("link#theme").attr("href", "css/style-" + theme + ".css");
    getStringKeys();

    await actionSDK.executeApi(new actionSDK.HideLoadingIndicator.Request());

}

var root = document.getElementById("root");

/* Method loads the landing page */
function OnPageLoad() {
    actionSDK
        .executeApi(new actionSDK.GetContext.Request())
        .then(function(response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            actionContext = response.context;
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
    var getActionRequest = new actionSDK.GetAction.Request(actionId);
    var getSummaryRequest = new actionSDK.GetActionDataRowsSummary.Request(
        actionId,
        true
    );
    var getDataRowsRequest = new actionSDK.GetActionDataRows.Request(actionId);
    var batchRequest = new actionSDK.BaseApi.BatchRequest([
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

    /*  Head Section  */
    head();

    /*  Person Responded X of Y Responses  */
    getSubscriptionCount = new actionSDK.GetSubscriptionMemberCount.Request(
        actionContext.subscription
    );
    let response = await actionSDK.executeApi(getSubscriptionCount);

    var $pcard = $('<div class="progress-section"></div>');

    let memberCount = response.memberCount;
    let participationPercentage = 0;

    participationPercentage = Math.round(
        (actionSummary.rowCreatorCount / memberCount) * 100
    );
    Localizer.getString('participation', participationPercentage).then(function(result) {
        $pcard.append(
            `<label><strong>${result}</strong></label><div class="progress mb-2"><div class="progress-bar bg-primary" role="progressbar" style="width: ${participationPercentage}%" aria-valuenow="${participationPercentage}" aria-valuemin="0" aria-valuemax="100"></div></div>`
        );
    });
    Localizer.getString('xofy_people_responded', actionSummary.rowCount, memberCount).then(function(result) {
        var xofy = result;
        $pcard.append(`<p class="date-color cursur-pointer under-line md-0" id="show-responders">${xofy}</p>`);
    });

    $("#root").append($pcard);
    await getUserprofile();
    if (Object.keys(ResponderDate).length > 0) {
        ResponderDate.forEach((responder) => {
            if (responder.value2 == myUserId) {
                createReponderQuestionView(myUserId, responder);
            }
        });
    } else {
        actionNonResponders.forEach((nonresponders) => {
            if (nonresponders.value2 == myUserId) {
                var name = nonresponders.label;
                var matches = name.match(/\b(\w)/g); // [D,P,R]
                var initials = matches.join('').substring(0, 2); // DPR
                Localizer.getString('you_yet_respond').then(function(result) {
                    $('div.progress-section').after(`<hr class="small">`);
                    $('div.progress-section').after(`<div class="d-flex cursur-pointer mt-4 mb-4 getresult" id="${nonresponders.value2}">
                            <div class="avtar">
                                ${initials}
                            </div>
                            <div class="avtar-txt">${result}</div>
                        </div>`);
                });
                $('div.progress-section').after(`<hr class="small">`);
            }
        })
    }

    return true;
}

/* Method for creating head section for title, progress bar, dueby */
function head() {
    var title = actionInstance.displayName;
    var description = actionInstance.customProperties[0]["value"];
    var dueby = new Date(actionInstance.expiryTime).toDateString();

    var $card = $('<div class=""></div>');
    var $title_sec = $("<h4>" + title + "</h4>");
    var $description_sec = $(`<p class="mb0">${description}</p>`);

    var current_timestamp = new Date().getTime();

    var $date_sec = $(`<p><small>${actionInstance.expiryTime > current_timestamp ? dueByKey+' ' : expiredOnKey+' '} ${dueby}</small></p>`);

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
        var id = ResponderDate[itr].value2;
        var name = "";
        if (ResponderDate[itr].value2 == myUserId) {
            name = youKey;
        } else {
            name = ResponderDate[itr].label;
        }
        var date = ResponderDate[itr].value;

        var matches = ResponderDate[itr].label.match(/\b(\w)/g); // [D,P,R]
        var initials = matches.join('').substring(0, 2); // DPR


        $(".tabs-content:first")
            .find("table#responder-table tbody")
            .append(
                `<tr id="${ResponderDate[itr].value2}" class="getresult cursur-pointer">
                    <td>
                        <div class="d-flex ">
                            <div class="avtar">
                                ${initials}
                            </div>
                            <div class="avtar-txt">${name}</div>
                        </div>
                    </td>
                    <td  class="text-right avtar-txt">
                        ${date}
                        <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="right-carate">
                            <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                            </path>
                            <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                            </path>
                        </svg>
                    </td>
                </tr>`
            );
    }
}

/* Method for fetch list of non-responders in the channel */
function getNonresponders() {
    $("table#non-responder-table tbody").html("");

    for (let itr = 0; itr < actionNonResponders.length; itr++) {
        var id = actionNonResponders[itr].value2;
        var name = "";
        if (actionNonResponders[itr].value2 == myUserId) {
            name = "You";
        } else {
            name = actionNonResponders[itr].label;
        }
        var matches = actionNonResponders[itr].label.match(/\b(\w)/g); // [D,P,R]
        var initials = matches.join('').substring(0, 2); // DPR

        var date = actionNonResponders[itr].value;
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
    var userId = $(this).attr("id");
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
        var name = responder.label;
        var matches = name.match(/\b(\w)/g); // [D,P,R]
        var initials = matches.join('').substring(0, 2); // DPR
        $('div.progress-section').after(`<hr class="small">`);

        Localizer.getString('you_responded').then(function(result) {
            $('div.progress-section').after(`<div class="d-flex cursur-pointer mt-4 mb-4 getresult" data-attr="home" id="${myUserId}">
                    <div class="avtar">
                        ${initials}
                    </div>
                    <div class="avtar-txt">${result}</div>
                </div>`);
            $('div.progress-section').after(`<hr class="small">`);
        });
    }

    actionInstance.dataTables.forEach((dataTable) => {
        total = Object.keys(dataTable.dataColumns).length;

        dataTable.dataColumns.forEach((question, ind) => {
            answer_is = "";
            var $cardDiv = $('<div class="card-box card-blank bt"></div>');
            var $rowdDiv = $('<div class="row"></div>');
            var $dflexDiv = $('<div class="d-table"></div>');
            var $qDiv = $('<div class="col-sm-12"></div>');
            $cardDiv.append($rowdDiv);
            $rowdDiv.append($qDiv);
            $cardDiv.append($dflexDiv);
            var count = ind + 1;
            var $questionHeading = $("<label></label>");
            $questionHeading.append(
                "<strong>" + count + ". " + question.displayName + "</strong>"
            );

            $dflexDiv.append($questionHeading);

            $dflexDiv.append(
                '<label class="float-right" id="status-' + question.name + '"></label>'
            );

            question.options.forEach((option) => {
                /* User Responded */
                var userResponse = [];
                var userResponseAnswer = "";
                for (let i = 0; i < actionDataRowsLength; i++) {
                    if (actionDataRows[i].creatorId == userId) {
                        userResponse = actionDataRows[i].columnValues;
                        var userResponseLength = Object.keys(userResponse).length;

                        for (var j = 1; j <= userResponseLength; j++) {
                            if (isJson(userResponse[j])) {
                                var userResponseAns = JSON.parse(userResponse[j]);
                                var userResponseAnsLen = userResponseAns.length;
                                if (userResponseAnsLen > 1) {
                                    for (var k = 0; k < userResponseAnsLen; k++) {
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
                var correctResponse = JSON.parse(
                    actionInstance.customProperties[4].value
                );
                var correctResponseLength = Object.keys(correctResponse).length;
                var correctAnswer = "";
                for (let j = 0; j < correctResponseLength; j++) {
                    var correctResponseAns = correctResponse[j];
                    var correctResponseAnsLen = correctResponseAns.length;
                    for (let k = 0; k < correctResponseAnsLen; k++) {
                        if (correctResponseAns[k] == option.name) {
                            correctAnswer = correctResponseAns[k];
                        }
                    }
                }

                var $radioOption = getOptions(
                    option.displayName,
                    question.name,
                    option.name,
                    userResponseAnswer,
                    correctAnswer
                );
                $cardDiv.append($radioOption);
                $cardDiv.find("#status-" + question.name).html(`<span class="${answer_is == 'Correct' ? 'text-success' : 'text-danger'}">${answer_is == 'Correct' ? correctKey : incorrectKey}</span>`);
            });

            if (answer_is == "Correct") {
                score++;
            }
            $("#root").append($cardDiv);
        });
    });
    $("#root").append('<div class="ht-100"></div>');
    var scorePercentage = Math.round((score / total) * 100);

    Localizer.getString("score", ":").then(function(result) {
        $("#root > hr.small:last").after(`<div class=""><label><strong>${result} </strong>${scorePercentage}%</label></div>`);
    });
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
            answer_is = "";
            var $cardDiv = $('<div class="card-box card-blank bt"></div>');
            var $rowdDiv = $('<div class="row"></div>');
            var $qDiv = $('<div class="col-sm-12"></div>');
            $cardDiv.append($rowdDiv);
            $rowdDiv.append($qDiv);
            var count = ind + 1;
            var $questionHeading = $("<label></label>");
            $questionHeading.append(
                "<strong>" + count + ". " + question.displayName + "</strong>"
            );
            $cardDiv.append($questionHeading);

            $cardDiv.append(
                '<label class="float-right" id="status-' + question.name + '"></label>'
            );
            question.options.forEach((option) => {
                /* User Responded */
                var userResponse = [];
                var userResponseAnswer = "";
                for (let i = 0; i < actionDataRowsLength; i++) {
                    if (actionDataRows[i].creatorId == userId) {
                        userResponse = actionDataRows[i].columnValues;
                        var userResponseLength = Object.keys(userResponse).length;

                        for (var j = 1; j <= userResponseLength; j++) {
                            if (isJson(userResponse[j])) {
                                var userResponseAns = JSON.parse(userResponse[j]);
                                var userResponseAnsLen = userResponseAns.length;
                                if (userResponseAnsLen > 1) {
                                    for (var k = 0; k < userResponseAnsLen; k++) {
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
                var correctResponse = JSON.parse(
                    actionInstance.customProperties[4].value
                );
                var correctResponseLength = Object.keys(correctResponse).length;
                var correctAnswer = "";
                for (let j = 0; j < correctResponseLength; j++) {
                    var correctResponseAns = correctResponse[j];
                    var correctResponseAnsLen = correctResponseAns.length;
                    for (let k = 0; k < correctResponseAnsLen; k++) {
                        if (correctResponseAns[k] == option.name) {
                            correctAnswer = correctResponseAns[k];
                        }
                    }
                }

                var $radioOption = getOptions(
                    option.displayName,
                    question.name,
                    option.name,
                    userResponseAnswer,
                    correctAnswer
                );
                $cardDiv.append($radioOption);
                $cardDiv.find("#status-" + question.name).html(`<span class="${answer_is == 'Correct' ? 'text-success' : 'text-danger'}">${answer_is}</span>`);

            });

            if (answer_is == "Correct") {
                score++;
            }
            $("div.question-content:first").append($cardDiv);
        });

    });
    $("div.question-content:first").append('<div class="ht-100"></div>');

    var scorePercentage = Math.round((score / total) * 100);

    Localizer.getString("score", ":").then(function(result) {
        $("#root > div:first").after(`<div class=""><label><strong>${result} </strong>${scorePercentage}%</label></div>`);
    });
}

/* 
 * @desc Method for Question view based on user id  
 * @param text String contains correct and incorrect message
 * @param name String contains option name
 * @param id String contains option id
 * @param userResponse String contains user response data
 * @param correctAnswer String contains correct answer 
 */
function getOptions(text, name, id, userResponse, correctAnswer) {
    var $oDiv = $('<div class="form-group"></div>');
    /*  If answer is correct  and answered */
    if ($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) == $.trim(id)) {
        $oDiv.append(
            '<div class="form-group alert alert-success"><p class="mb0">' +
            text +
            ' <i class="fa  pull-right fa-check"></i> </p></div>'
        );
        if (answer_is == "") {
            answer_is = "Correct";
        }
    } else if ($.trim(userResponse) != $.trim(id) && $.trim(correctAnswer) == $.trim(id)) {
        /* If User Response is incorrect and not answered */
        $oDiv.append(
            '<div class="form-group alert alert-normal"><p class="mb0">' +
            text +
            ' <i class="fa fa-pull-right text-success fa-check"></p></div>'
        );
    } else if ($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) != $.trim(id)) {
        /* If User Response is incorrect and answered */
        $oDiv.append(
            '<div class="form-group alert alert-danger"><p class="mb0">' +
            text +
            '<i class="fa fa-pull-right fa-close"></i></p></div>'
        );
        answer_is = "Incorrect";
    } else {
        $oDiv.append(
            '<div class="form-group alert alert-normal""><p class="mb0">' +
            text +
            "</p></div>"
        );
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
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class="cursur-pointer back1" userid-data="${userId}" id="hide2">
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
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class="cursur-pointer back" id="hide2">
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
                <div class="container ">
                    <div class="row">
                        <div class="col-9">
                            <a class="cursur-pointer back" id="hide2">
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
    var userId = $(this).attr("userid-data");
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
                var $card1 = $('<div class="card-box card-blank"></div>');
                var tabs = $(".tabs-content").clone();
                $card1.append(tabs.clone());
                $("#root").append($card1);
                footer1();
            }

            /*  Add Responders  */
            getResponders();

            /*  Add Non-reponders  */
            getNonresponders();
        } else {
            alert("Visible to sender only");
        }
    } else {
        $("#root").html("");
        if ($(".tabs-content:visible").length <= 0) {
            var $card1 = $('<div class="card-box card-blank"></div>');
            var tabs = $(".tabs-content").clone();
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
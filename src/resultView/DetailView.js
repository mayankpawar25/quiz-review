// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ActionHelper, Localizer } from "../common/ActionSdkHelper";
import * as html2canvas from "html2canvas";
import { UxUtils } from "./../common/utils/UxUtils";
import { Utils } from "./../common/utils/Utils";
import { KeyboardAccess } from "./../common/utils/KeyboardUtils";

let actionContext = null;
let actionInstance = null;
let actionSummary = null;
let actionDataRows = null;
let actionDataRowsLength = 0;
let responderDate = [];
let actionNonResponders = [];
let myUserId = "";
let score = 0;
let total = 0;
let answerIs = "";
let request = ActionHelper.getContextRequest();
let dataResponse = "";
let actionId = "";
let root = document.getElementById("root");
let theme = "";
let isCreator = false;
let context = "";

let dueByKey = "";
let expiredOnKey = "";
let correctKey = "";
let incorrectKey = "";
let backKey = "";
let youKey = "";
let questionKey = "";
let scoreKey = "";
let closeKey = "";
let changeDueByKey = "";
let closeQuizKey = "";
let deleteQuizKey = "";
let downloadImageKey = "";
let downloadCSVKey = "";
let downloadKey = "";
let closeQuizConfirmKey = "";
let deleteQuizConfirmKey = "";
let cancelKey = "";
let confirmKey = "";
let changeKey = "";
let changeDueDateKey = "";

/* ********************************* Events ******************************************** */

/**
 * @event Keydown Event for rerender the landing page
 */
KeyboardAccess.keydownClick(document, ".back");

/**
 * @event Click Event for rerender the landing page
 */
$(document).on({
    click: function(e) {
        createBody();
    }
}, ".back");

/**
 * @event Click Event for back to responder and non responder page
 */
$(document).on("click", "#closeKey", function() {
    let closeViewRequest = ActionHelper.closeView();

    ActionHelper
        .executeApi(closeViewRequest)
        .then(function(batchResponse) {
            console.info("BatchResponse: " + JSON.stringify(batchResponse));
        })
        .catch(function(error) {
            console.error("Error3: " + JSON.stringify(error));
        });
});

/**
 * @event Keydown Event for back to responder and non responder page
 */
KeyboardAccess.keydownClick(document, ".back1");

/**
 * @event Click Event for back to responder and non responder page
 */
$(document).on({
    click: function(e) {
        let userId = $(this).attr("userid-data");
        create_responder_nonresponders();
    }
}, ".back1");

/**
 * @event Click and Keydown Event for responder page
 */
$(document).on({
    click: function(e) {
        create_responder_nonresponders();
    },
    keydown: function(e) {
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    }
}, "#show-responders");

/**
 * @event Keydown event fetching result of responders
 */
KeyboardAccess.keydownClick(document, ".getresult");

/**
 * @event Click event fetching result of responders
 */
$(document).on({
    click: function(e) {
        let userId = $(this).attr("id");
        $("#root").html("");
        head();
        createQuestionView(userId);
        if ($(this).attr("data-attr") !== undefined) {
            footerResponderNonResponderTabs();
        } else {
            footer(userId);
        }
    }
}, ".getresult");

/**
 * @event Keydown event on responder tab
 */
KeyboardAccess.keydownClick(document, ".responder-key");

/**
 * @event Keydown event on non-responders tab
 */
KeyboardAccess.keydownClick(document, ".non-responder-key");

/**
 * @event Keydown event for download CSV
 */
KeyboardAccess.keydownClick(document, "#downloadCSV");

/**
 * @event Click event for download CSV
 */
$(document).on({
    click: function(e) {
        ActionHelper.downloadCSV(actionId, "quiz");
    }
}, "#downloadCSV");

/**
 * @event Keydown event for download image in png
 */
KeyboardAccess.keydownClick(document, "#downloadImage");

/**
 * @event Click event for download image in png
 */
$(document).on({
    click: function(e) {
        let bodyContainerDiv = document.getElementsByClassName("container")[0];
        let backgroundColorOfResultsImage = theme;
        $(".footer").hide();
        html2canvas(bodyContainerDiv, {
            width: bodyContainerDiv.scrollWidth,
            height: bodyContainerDiv.scrollHeight,
            backgroundColor: backgroundColorOfResultsImage,
            useCORS: true,
        }).then((canvas) => {
            let fileName = "quiz";
            let base64Image = canvas.toDataURL("image/png");
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(canvas.msToBlob(), fileName);
            } else {
                let data = base64Image;
                if (data && fileName) {
                    let a = document.createElement("a");
                    a.href = data;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
            }
            $(".footer").show();
        });
    }
}, "#downloadImage");

/**
 * @event Keydown event to show change due by date
 */
KeyboardAccess.keydownClick(document, ".change-due-by-event");

/**
 * @event Click event to show change due by date
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        $(".change-date").remove();
        $(".close-quiz").remove();
        $(".delete-quiz").remove();

        changeDateSection();

        let ddtt = ((actionInstance.customProperties[1].value).split("T"));
        let dt = ddtt[0].split("-");
        let weekDateFormat = new Date(dt[1]).toLocaleString("default", { month: "short" }) + " " + dt[2] + ", " + dt[0];
        let timeData = new Date(actionInstance.expiryTime);
        let hourData = timeData.getHours();
        let minuteData = timeData.getMinutes();
        let currentTime = hourData + ":" + minuteData;
        $(".form_date input").val(weekDateFormat);
        $(".form_date").attr({ "data-date": weekDateFormat });
        $(".form_time").datetimepicker({
            language: "en",
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 1,
            minView: 0,
            maxView: 1,
            forceParse: 0
        });

        $(".form_time input").val(currentTime);

        let dateInput = $("input[name='expiry_date']");
        let container = $(".bootstrap-iso form").length > 0 ? $(".bootstrap-iso form").parent() : "body";
        let options = {
            format: "M dd, yyyy",
            container: container,
            todayHighlight: true,
            autoclose: true,
            orientation: "top"
        };
        dateInput.datepicker(options);
        return false;
    }
}, ".change-due-by-event");

/**
 * @event Keydown event to show close quiz
 */
KeyboardAccess.keydownClick(document, ".close-quiz-event");

/**
 * @event Click event to show close quiz
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        $(".change-date").remove();
        $(".close-quiz").remove();
        $(".delete-quiz").remove();
        closeQuizSection();
        return false;
    }
}, ".close-quiz-event");

/**
 * @event Keydown event to show delete quiz
 */
KeyboardAccess.keydownClick(document, ".delete-quiz-event");

/**
 * @event Click event to show delete quiz
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        $(".change-date").remove();
        $(".close-quiz").remove();
        $(".delete-quiz").remove();
        deleteQuizSection();
        return false;
    }
}, ".delete-quiz-event");

/**
 * @event Click event to close change, close and delete quiz confirm section
 */
$(document).on("click", ".cancel-question-delete", function() {
    $(".change-date").remove();
    $(".close-quiz").remove();
    $(".delete-quiz").remove();
});

/**
 * @event Click event for close dropdown lists
 */
$(document).on("click", ".threedots .dropdown-menu a", function(event) {
    $(".threedots .dropdown-menu").toggleClass("show");
});

/**
 * @event Click event for delete quiz
 */
$(document).on("click", "#delete-quiz", function() {
    ActionHelper.deleteActionInstance(actionId);
});

/**
 * @event Click event for change quiz expiry date
 */
$(document).on("click", "#change-quiz-question", function() {
    ActionHelper.closeActionInstance(actionId, actionInstance.version);
});

/**
 * @event Change event for expiry date and time
 */
$(document).on("change", "input[name='expiry_time'], input[name='expiry_date']", function() {
    $("#change-quiz-date").removeClass("disabled");
});

$(document).on("click", "#change-quiz-date", function() {
    let quizExpireDate = $("input[name='expiry_date']").val();
    let quizExpireTime = $("input[name='expiry_time']").val();
    actionInstance.expiryTime = new Date(quizExpireDate + " " + quizExpireTime).getTime();
    actionInstance.customProperties[1].value = new Date(quizExpireDate + " " + quizExpireTime);
    ActionHelper.updateActionInstance(actionInstance);
});

/* ********************************* Methods ******************************************** */

/**
 * @description Initiate Method
 */
$(document).ready(function() {
    OnPageLoad();
});

/**
 * @description Calling method  for theme selection based on teams theme
 * @param request context request
 */
loadDetailView(request);

/**
 * @description Async method for fetching localization strings
 */
async function getStringKeys() {
    Localizer.getString("dueBy").then(function(result) {
        dueByKey = result;
    });

    Localizer.getString("question").then(function(result) {
        questionKey = result;
    });

    Localizer.getString("score", ":").then(function(result) {
        scoreKey = result;
    });

    Localizer.getString("expired_on").then(function(result) {
        expiredOnKey = result;
    });

    Localizer.getString("correct").then(function(result) {
        correctKey = result;
    });
    Localizer.getString("incorrect").then(function(result) {
        incorrectKey = result;
    });

    Localizer.getString("responders").then(function(result) {
        $(".responder-key").text(result);
    });

    Localizer.getString("non_responders").then(function(result) {
        $(".non-responder-key").text(result);
    });
    Localizer.getString("back").then(function(result) {
        backKey = result;
        $(".back-key").text(backKey);
    });

    Localizer.getString("close").then(function(result) {
        closeKey = result;
        $(".close-key").text(closeKey);
    });
    Localizer.getString("you").then(function(result) {
        youKey = result;
    });

    Localizer.getString("changeDueBy").then(function(result) {
        changeDueByKey = result;
        $(".change-due-by-key").text(changeDueByKey);
    });

    Localizer.getString("closeQuiz").then(function(result) {
        closeQuizKey = result;
        $(".close-quiz-key").text(closeQuizKey);
    });

    Localizer.getString("deleteQuiz").then(function(result) {
        deleteQuizKey = result;
        $(".delete-quiz-key").text(deleteQuizKey);
    });

    Localizer.getString("download").then(function(result) {
        downloadKey = result;
        $("#download-key").html(downloadKey);
    });

    Localizer.getString("downloadImage").then(function(result) {
        downloadImageKey = result;
        $("#download-image-key").html(downloadImageKey);
    });

    Localizer.getString("downloadCSV").then(function(result) {
        downloadCSVKey = result;
        $("#download-csv-key").html(downloadCSVKey);
    });

    Localizer.getString("closeQuizConfirm").then(function(result) {
        closeQuizConfirmKey = result;
        $(".close-quiz-confirm-key").html(closeQuizConfirmKey);
    });

    Localizer.getString("deleteQuizConfirm").then(function(result) {
        deleteQuizConfirmKey = result;
        $(".close-quiz-confirm-key").html(deleteQuizConfirmKey);
    });

    Localizer.getString("cancel").then(function(result) {
        cancelKey = result;
        $(".cancel-key").html(cancelKey);
    });

    Localizer.getString("confirm").then(function(result) {
        confirmKey = result;
        $(".confirm-key").html(confirmKey);
    });

    Localizer.getString("change").then(function(result) {
        changeKey = result;
        $(".change-key").html(changeKey);
    });

    Localizer.getString("changeDueDate").then(function(result) {
        changeDueDateKey = result;
        $(".change-due-date-key").html(changeDueDateKey);
    });

}

/**
 * @description Method to select theme based on the teams theme
 * @param request context request
 */

async function loadDetailView(request) {
    dataResponse = await ActionHelper.executeApi(request);
    context = dataResponse.context;
    $("form.section-1").show();
    theme = context.theme;
    $("link#theme").attr("href", "css/style-" + theme + ".css");
    getStringKeys();
    ActionHelper.hideLoader();
}

/**
 * @description Method loads the landing page
 */
function OnPageLoad() {
    ActionHelper
        .executeApi(request)
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

/**
 * @description Method to get data rows
 * @param request context action id
 */
function getDataRows(actionId) {
    let getActionRequest = ActionHelper.getActionRequest(actionId);
    let getSummaryRequest = ActionHelper.getDataRowSummary(
        actionId,
        true
    );
    let getDataRowsRequest = ActionHelper.requestDataRows(actionId);
    let batchRequest = ActionHelper.batchRequest([
        getActionRequest,
        getSummaryRequest,
        getDataRowsRequest,
    ]);

    ActionHelper.executeBatchApi(batchRequest)
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

/**
 * @description Method for creating the response view structure and initialize value
 */
async function createBody() {
    await getUserprofile();
    let getSubscriptionCount = "";
    $("#root").html("");

    console.log("actionInstance:");
    console.log(JSON.stringify(actionInstance));

    /*  Head Section  */
    if (myUserId == dataResponse.context.userId && myUserId == actionInstance.creatorId) {
        isCreator = true;
        headCreator();

        if (actionInstance.status == "Closed") {
            $(".close-quiz-event").remove();
            $(".change-due-by-event").remove();
        }
        if (actionInstance.status == "Expired") {
            $(".change-due-by-event").remove();
        }
    } else {
        head();
    }

    /*  Person Responded X of Y Responses  */
    getSubscriptionCount = ActionHelper.getSubscriptionMemberCount(
        actionContext.subscription
    );
    let response = await ActionHelper.executeApi(getSubscriptionCount);

    if (isCreator == true) {
        let $pcard = $(`<div class="progress-section"></div>`);
        let memberCount = response.memberCount;
        let participationPercentage = 0;

        participationPercentage = Math.round(
            (actionSummary.rowCreatorCount / memberCount) * 100
        );
        Localizer.getString("participation", participationPercentage).then(function(result) {
            $pcard.append(UxUtils.getParticipationProgress(result, participationPercentage));
        });
        Localizer.getString("xofy_people_responded", actionSummary.rowCount, memberCount).then(function(result) {
            let xofy = result;
            $pcard.append(UxUtils.getTotalPeopleRespondedString(xofy));
            $pcard.append(UxUtils.clearFix());
        });
        $("#root").append($pcard);
    }

    let responderDateLength = Object.keys(responderDate).length;
    if (responderDateLength > 0) {
        if (myUserId == dataResponse.context.userId && myUserId == actionInstance.creatorId) {
            createCreatorQuestionView();
        } else if (myUserId == dataResponse.context.userId && myUserId != actionInstance.creatorId) {
            let isResponded = false;
            responderDate.forEach((responder) => {
                if (responder.value2 == myUserId) {
                    createQuestionView(myUserId);
                    isResponded = true;
                }
            });

            if (isResponded == false) {
                actionNonResponders.forEach((nonresponders) => {
                    if (nonresponders.value2 == myUserId) {
                        let name = nonresponders.label;
                        let matches = name.match(/\b(\w)/g); // [D,P,R]
                        let initials = matches.join("").substring(0, 2); // DPR
                        Localizer.getString("you_yet_respond").then(function(result) {
                            $("div.progress-section").after(UxUtils.getInitials(nonresponders.value2, initials, result));
                            $("div.progress-section").after(UxUtils.breakline());
                            $("div#" + nonresponders.value2).after(UxUtils.breakline());
                        });
                    }
                });
            }
        } else {
            responderDate.forEach((responder) => {
                if (responder.value2 == myUserId) {
                    createResponderQuestionView(myUserId, responder);
                }
            });
        }

    } else {
        actionNonResponders.forEach((nonresponders) => {
            if (nonresponders.value2 == myUserId) {
                if (myUserId == dataResponse.context.userId && myUserId == actionInstance.creatorId) {
                    createCreatorQuestionView();
                } else {
                    let name = nonresponders.label;
                    let matches = name.match(/\b(\w)/g); // [D,P,R]
                    let initials = matches.join("").substring(0, 2); // DPR
                    Localizer.getString("you_yet_respond").then(function(result) {
                        $("div.progress-section").after(UxUtils.getInitials(nonresponders.value2, initials, result));
                        $("div.progress-section").after(UxUtils.breakline());
                        $("div#" + nonresponders.value2).after(UxUtils.breakline());
                    });
                }
            }
        });
    }

    if (isCreator == true) {
        if (context.hostClientType == "web") {
            footerDownload();
        }
    } else {
        footerClose();
    }
    return true;
}

/**
 * @description Method for creating head section for title, progress bar, dueby
 */
function head() {
    let title = actionInstance.displayName;
    let description = actionInstance.customProperties[0]["value"];
    let dueby = new Date(actionInstance.expiryTime).toDateString();
    let $card = $(`<div class=""></div>`);
    let $titleSec = $(UxUtils.getQuizTitleResponders(title));
    let $descriptionSec = $(UxUtils.getQuizDescription(description));
    let currentTimestamp = new Date().getTime();
    let $dateSec = $(UxUtils.getResponderQuizDate(actionInstance.expiryTime, currentTimestamp, dueByKey, expiredOnKey, dueby));
    $card.append($titleSec);
    $card.append($descriptionSec);
    $card.append($dateSec);
    $("#root").append($card);
    if (actionInstance.customProperties[4].value.length > 0) {
        let req = ActionHelper.getAttachmentInfo(actionId, actionInstance.customProperties[4].value);
        ActionHelper.executeApi(req).then(function(response) {
                $card.prepend(UxUtils.getQuizBannerImageWithLoader(response.attachmentInfo.downloadUrl));
                Utils.getClassFromDimension(response.attachmentInfo.downloadUrl, ".quiz-template-image");
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error7: " + JSON.stringify(error));
            });
    }
}

/**
 * @description Method for creating head section for title, progress bar, dueby
 */
function headCreator() {
    let title = actionInstance.displayName;
    let description = actionInstance.customProperties[0]["value"];
    let dueby = new Date(actionInstance.expiryTime).toDateString();
    let $card = $(`<div class=""></div>`);
    let $titleDiv = $(`<div class="d-table mb--4"></div>`);
    let $titleSec = $(UxUtils.getQuizTitle(title));
    let $creatorButtons = $(UxUtils.creatorQuizDateManageSection(changeDueByKey, closeQuizKey, deleteQuizKey));
    let $descriptionSec = $(UxUtils.getQuizDescription(description));
    let currentTimestamp = new Date().getTime();
    let $dateSec = $(`<p class="mb--16 date-text font-12">${actionInstance.expiryTime > currentTimestamp ? dueByKey + " " : expiredOnKey + " "} ${dueby}</p>`);
    $titleDiv.append($titleSec);
    $titleDiv.append($creatorButtons);
    $card.append($titleDiv);
    $card.append($descriptionSec);
    $card.append($dateSec);
    $("#root").append($card);
    if (actionInstance.customProperties[4].value.length > 0) {
        let req = ActionHelper.getAttachmentInfo(actionId, actionInstance.customProperties[4].value);
        ActionHelper.executeApi(req).then(function(response) {
                $card.prepend(UxUtils.getQuizBannerImageWithLoader(response.attachmentInfo.downloadUrl));
                Utils.getClassFromDimension(response.attachmentInfo.downloadUrl, ".quiz-template-image");
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error7: " + JSON.stringify(error));
            });
    }
}

/**
 * @description Method for fetch responder user details
 */
async function getUserprofile() {
    let memberIds = [];
    responderDate = [];
    actionNonResponders = [];
    if (actionDataRowsLength > 0) {
        for (let i = 0; i < actionDataRowsLength; i++) {
            memberIds.push(actionDataRows[i].creatorId);
            let requestResponders = ActionHelper.getSusbscriptionMembers(
                actionContext.subscription, [actionDataRows[i].creatorId]
            ); // ids of responders

            let responseResponders = await ActionHelper.executeApi(requestResponders);
            let perUserProfile = responseResponders.members;
            responderDate.push({
                label: perUserProfile[0].displayName,
                value: new Date(actionDataRows[i].updateTime).toDateString(),
                value2: perUserProfile[0].id,
            });
        }
    }

    myUserId = actionContext.userId;
    let requestNonResponders = ActionHelper.getSubscriptionNonParticipants(
        actionContext.actionId,
        actionContext.subscription.id
    );
    let responseNonResponders = await ActionHelper.executeApi(requestNonResponders);
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

/**
 * @description Method for fetch list of responders
 */
function getResponders() {
    $("table#responder-table tbody").html("");

    for (let itr = 0; itr < responderDate.length; itr++) {
        let id = responderDate[itr].value2;
        let name = "";
        if (responderDate[itr].value2 == myUserId) {
            name = youKey;
        } else {
            name = responderDate[itr].label;
        }
        let date = responderDate[itr].value;

        let matches = responderDate[itr].label.match(/\b(\w)/g); // [D,P,R]
        let initials = matches.join("").substring(0, 2); // DPR

        let score = scoreCalculate(responderDate[itr].value2);

        $(".tabs-content:first")
            .find("table#responder-table tbody")
            .append(UxUtils.getResponderScoreWithDate(responderDate[itr].value2, initials, name, date, scoreKey, score));
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

        /* Correct Answer */
        let correctResponse = JSON.parse(
            actionInstance.customProperties[5].value
        );

        for (let i = 0; i < actionDataRowsLength; i++) {
            if (actionDataRows[i].creatorId == userId) {
                for (let c = 0; c < correctResponse.length; c++) {
                    let correctAnsString = "";
                    let userAnsString = "";
                    if ($.isArray(correctResponse[c])) {
                        if (correctResponse[c].length > 1) {
                            correctAnsString = correctResponse[c].join(",");
                        } else {
                            correctAnsString = correctResponse[c][0];
                        }
                    } else {
                        correctAnsString = correctResponse[c];
                    }

                    if (Utils.isJson(actionDataRows[i].columnValues[c + 1])) {
                        let responderAnsArr = JSON.parse(actionDataRows[i].columnValues[c + 1]);
                        if (responderAnsArr.length > 1) {
                            userAnsString = responderAnsArr.join(",");
                        } else {
                            userAnsString = responderAnsArr[0];
                        }
                    } else {
                        userAnsString = actionDataRows[i].columnValues[c + 1];
                    }

                    if (correctAnsString == userAnsString) {
                        score++;
                    }

                }
            }
        }
    });
    let scoreIs = (score / total) * 100;
    if (scoreIs % 1 != 0) {
        scoreIs = scoreIs.tofixed(2);
    }
    return scoreIs;
}

/**
 * @description Method for fetch list of non-responders in the channel
 */
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
        let initials = matches.join("").substring(0, 2); // DPR

        let date = actionNonResponders[itr].value;
        $(".tabs-content:first")
            .find("table#non-responder-table tbody")
            .append(UxUtils.getInitialNonResponders(initials, name));
    }
}

/**
 * @description Method to creat4e responder correct and incorrect quiz responses
 * @param userId contains user id for identifications
 * @param responder contains responders
 */
function createResponderQuestionView(userId, responder = "") {
    total = 0;
    score = 0;

    $("div#root > div.question-content").html("");

    if (responder != "") {
        let name = responder.label;
        let matches = name.match(/\b(\w)/g); // [D,P,R]
        let initials = matches.join("").substring(0, 2); // DPR

        Localizer.getString("you_responded").then(function(result) {
            $("div.progress-section").after(UxUtils.getInitialsResponders(myUserId, initials));
            $("div.progress-section").after(UxUtils.breakline());
            $("div#" + myUserId).after(UxUtils.breakline());
        });
    }

    actionInstance.dataTables.forEach((dataTable) => {
        total = Object.keys(dataTable.dataColumns).length;

        dataTable.dataColumns.forEach((question, ind) => {
            answerIs = "";
            let $cardDiv = $(`<div class="card-box card-bg card-border alert-success mb--8"></div>`);
            let $questionContentDiv = $(`<div class="question-content disabled2"></div>`);
            let $rowdDiv = $(`<div class="mt--16"></div>`);
            let $dflexDiv = $(`<div class="d-table mb--4"></div>`);
            $questionContentDiv.append($rowdDiv);
            $questionContentDiv.append($dflexDiv);
            let count = ind + 1;
            let $questionHeading = $(`<label class="font-12"></label>`);
            $questionHeading.append(UxUtils.getQuestionNumberContainerResponder(questionKey, count));
            $questionHeading.append(`<label class="float-right" id="status-1 "></label>`);

            $dflexDiv.append($questionHeading);

            $dflexDiv.append(UxUtils.getQuestionTitleContainer(question.displayName));

            let optAnsArr = [];
            let isRadio = true;
            if (JSON.parse(actionInstance.customProperties[5].value)[ind].length > 1) {
                isRadio = false;
            }
            question.options.forEach((option, optind) => {
                /* User Responded */
                let userResponse = [];
                let userResponseAnswer = "";
                for (let i = 0; i < actionDataRowsLength; i++) {
                    if (actionDataRows[i].creatorId == userId) {
                        userResponse = actionDataRows[i].columnValues;
                        let userResponseLength = Object.keys(userResponse).length;

                        for (let j = 1; j <= userResponseLength; j++) {
                            if (Utils.isJson(userResponse[j])) {
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
                                    if (userResponseAns[0] == option.name) {
                                        userResponseAnswer = userResponseAns[0];
                                    }
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

                let optName = option.displayName;
                let optAttachmentId = option.attachments != "" ? option.attachments[0].id : "";

                if (isRadio) {
                    let $radioOption = getRadioOptions(
                        optName,
                        question.name,
                        option.name,
                        userResponseAnswer,
                        correctAnswer,
                        optAttachmentId
                    );
                    $cardDiv.append($radioOption);
                } else {
                    let $checkOption = getCheckOptions(
                        optName,
                        question.name,
                        option.name,
                        userResponseAnswer,
                        correctAnswer,
                        optAttachmentId
                    );
                    $cardDiv.append($checkOption);
                }

                if (answerIs.toLowerCase() == "correct") {
                    optAnsArr[optind] = answerIs;
                } else {
                    optAnsArr[optind] = "incorrect";
                }
            });
            $cardDiv.find("#status-" + question.name).html(`<span class="${answerIs == "Correct" ? "text-success" : "text-danger"}">${answerIs == "Correct" ? correctKey : incorrectKey}</span>`);
            if (optAnsArr.includes("incorrect") == false) {
                score++;
            }
            $("#root").append($cardDiv);
        });
    });
    $("#root").append(`<div class="ht-100"></div>`);
    let scorePercentage = (score / total) * 100;
    if (scorePercentage % 1 != 0) {
        scorePercentage = scorePercentage.tofixed(2);
    }

    Localizer.getString("score", ":").then(function(result) {
        $("#root > hr.small:last").after(UxUtils.getScoreResponderContainer(result, scorePercentage));
    });
}

/**
 * @description Method to create responder correct and incorrect quiz responses
 */
function createCreatorQuestionView() {
    total = 0;
    let count = 1;
    score = 0;

    $("div#root > div.question-content").html("");

    Localizer.getString("aggregrateResult").then(function(result) {
        $("div.progress-section").after(UxUtils.getaggregrateTextContainer(myUserId, result));
    });

    actionInstance.dataTables.forEach((dataTable) => {
        let scoreArray = {};
        let correctResponse = JSON.parse(
            actionInstance.customProperties[5].value
        );

        dataTable.dataColumns.forEach((question, ind) => {
            let correctCounter = 0;
            answerIs = "";
            let $quesContDiv = $(`<div class="question-content disabled2" id="content-${question.name}"></div>`);
            let $mtDiv = $(`<div class="mt--16"></div>`);
            let $dflexDiv = $(`<div class="d-table mb--4"></div>`);

            $quesContDiv.append($mtDiv);
            $("#root").append($quesContDiv);
            let count = ind + 1;
            let attachmentId = question.attachments != "" ? question.attachments[0].id : "";

            $dflexDiv.append(UxUtils.getQuestionNumberContainer(questionKey, count));
            $dflexDiv.append(`<label class="float-right font-12 bold" id="status-${question.name}"> </label>`);
            $mtDiv.append($dflexDiv);
            let $blankQDiv = $(`<div class=""></div>`);
            $mtDiv.append($blankQDiv);
            $blankQDiv.append(`
                    <div class="semi-bold font-16 mb--16">${question.displayName}</div>
            `);
            let questionAttachmentId = question.attachments.length > 0 ? question.attachments[0].id : "";
            if (questionAttachmentId.length > 0) {
                let req = ActionHelper.getAttachmentInfo(actionId, attachmentId);
                ActionHelper.executeApi(req).then(function(response) {
                        console.info("Attachment - Response: " + JSON.stringify(response));
                        $blankQDiv.prepend(UxUtils.quizTemplateImageWithLoader(response.attachmentInfo.downloadUrl));
                        Utils.getClassFromDimension(response.attachmentInfo.downloadUrl, `#content-${question.name} img.question-image`);
                    })
                    .catch(function(error) {
                        console.error("AttachmentAction - Error: " + JSON.stringify(error));
                    });
            }

            if (attachmentId.length > 0) {
                let req = ActionHelper.getAttachmentInfo(actionId, attachmentId);
                ActionHelper.executeApi(req).then(function(response) {
                        console.info("Attachment - Response: " + JSON.stringify(response));
                        $mtDiv.find("d-table").after(UxUtils.questionTemplateImage(response.attachmentInfo.downloadUrl));
                        Utils.getClassFromDimension(response.attachmentInfo.downloadUrl, `#content-${question.name} img.question-template-image`);
                    })
                    .catch(function(error) {
                        console.error("AttachmentAction - Error: " + JSON.stringify(error));
                    });
            }
            let correctAnswerCounter = 0;
            scoreArray[question.name] = 0;

            /* check for correct answer for each users */
            for (let i = 0; i < actionDataRowsLength; i++) {

                for (let c = 0; c < correctResponse.length; c++) {
                    let correctAnsString = "";
                    let userAnsString = "";
                    if ($.isArray(correctResponse[c])) {
                        if (correctResponse[c].length > 1) {
                            correctAnsString = correctResponse[c].join(",");
                        } else {
                            correctAnsString = correctResponse[c][0];
                        }
                    } else {
                        correctAnsString = correctResponse[c];
                    }

                    if (Utils.isJson(actionDataRows[i].columnValues[count])) {
                        let responderAnsArr = JSON.parse(actionDataRows[i].columnValues[count]);
                        if (responderAnsArr.length > 1) {
                            userAnsString = responderAnsArr.join(",");
                        } else {
                            userAnsString = responderAnsArr[0];
                        }
                    } else {
                        userAnsString = actionDataRows[i].columnValues[count];
                    }

                    if (correctAnsString == userAnsString) {
                        scoreArray[question.name] = scoreArray[question.name] + 1;
                    }

                }
            }

            let isRadio = true;
            if (JSON.parse(actionInstance.customProperties[5].value)[ind].length > 1) {
                isRadio = false;
            }

            question.options.forEach((option, iii) => {
                /* User Responded */
                let $cardDiv = $(`<div class="card-box card-bg card-border mb--8 "></div>`);
                let userResponse = [];
                let userResponseAnswer = "";
                for (let i = 0; i < actionDataRowsLength; i++) {
                    userResponse = actionDataRows[i].columnValues;
                    let userResponseLength = Object.keys(userResponse).length;
                    let userResArr = [];
                    for (let j = 1; j <= userResponseLength; j++) {
                        if (Utils.isJson(userResponse[j])) {
                            let userResponseAns = JSON.parse(userResponse[j]);
                            let userResponseAnsLen = userResponseAns.length;
                            if (userResponseAnsLen > 1) {
                                for (let k = 0; k < userResponseAnsLen; k++) {
                                    if (userResponseAns[k] == option.name) {
                                        userResponseAnswer = userResponseAns[k];
                                        userResArr.push(userResponseAnswer);
                                    }
                                }
                            } else {
                                if (userResponseAns[0] == option.name) {
                                    userResponseAnswer = userResponseAns[0];
                                    userResArr.push(userResponseAnswer);
                                }
                            }
                        } else {
                            if (userResponse[j] == option.name) {
                                userResponseAnswer = userResponse[j];
                                userResArr.push(userResponseAnswer);
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
                            correctAnswerCounter++;
                        }
                    }
                }

                let optName = option.displayName;
                let attachmentId = option.attachments != "" ? option.attachments[0].id : "";
                let optId = option.name;
                let $radioOption = "";
                let result = "";
                for (let j = 0; j < correctResponseLength; j++) {
                    let correctResponseAns = correctResponse[j];
                    if (correctResponseAns.includes(option.name)) {
                        result = "correct";
                    }
                }
                if (isRadio) {
                    $radioOption = getRadioOptionsCreator(
                        optName,
                        optId,
                        ind,
                        result,
                        attachmentId
                    );
                    $cardDiv.append($radioOption);
                } else {
                    let $checkOption = getCheckOptionsCreator(
                        optName,
                        optId,
                        ind,
                        result,
                        attachmentId
                    );
                    $cardDiv.append($checkOption);
                }
                $quesContDiv.append($cardDiv);
            });

            if (actionDataRowsLength == 0) {
                $dflexDiv.find("#status-" + question.name).html(`<span class="semi-bold">0% Correct</div>`);
            } else {
                let aggregrateQuestionScore = ((scoreArray[question.name] * 100) / actionDataRowsLength);
                if (aggregrateQuestionScore % 1 != 0) {
                    aggregrateQuestionScore = aggregrateQuestionScore.toFixed(2);
                }
                $dflexDiv.find("#status-" + question.name).html(UxUtils.getAggregrateScoreContainer(aggregrateQuestionScore, correctKey));
            }
        });
    });
}

/**
 * @description Method for Question view based on user id
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
            let $questionDiv = $(`<div class="question-content disabled2" id="content-${question.name}"></div>`);
            let $mtDiv = $(`<div class="mt--16"></div>`);
            let $dtableDiv = $(`<div class="d-table mb--4 "></div>`);
            let count = ind + 1;
            let questionAttachmentId = question.attachments != "" ? question.attachments[0].id : "";

            $questionDiv.append($mtDiv);
            $mtDiv.append($dtableDiv);
            $dtableDiv.append(UxUtils.getQuestionNumberContainer(questionKey, count));

            $dtableDiv.append(`<label class="float-right font-12 bold" id="status-${question.name}"></label>`);

            let $blankQDiv = $(`<div class=""></div>`);
            $mtDiv.append($blankQDiv);
            $blankQDiv.append(UxUtils.getQuestionTitleContainer(question.displayName));

            if (questionAttachmentId.length > 0) {
                let req = ActionHelper.getAttachmentInfo(actionId, questionAttachmentId);
                ActionHelper.executeApi(req).then(function(response) {
                        console.info("Attachment - Response: " + JSON.stringify(response));
                        $blankQDiv.prepend(UxUtils.getQuestionImageWithLoader(response.attachmentInfo.downloadUrl));
                        Utils.getClassFromDimension(response.attachmentInfo.downloadUrl, `#content-${question.name} img.question-image`);
                    })
                    .catch(function(error) {
                        console.error("AttachmentAction - Error: " + JSON.stringify(error));
                    });
            }

            let $blankDiv = $(`<div class=" "></div>`);
            $mtDiv.append($blankDiv);
            let optAnsArr = [];
            let isRadio = true;
            if (JSON.parse(actionInstance.customProperties[5].value)[ind].length > 1) {
                isRadio = false;
            }
            question.options.forEach((option, optind) => {
                /* User Responded */
                let userResponse = [];
                let userResponseAnswer = "";
                let correctAnsArr = [];
                for (let i = 0; i < actionDataRowsLength; i++) {
                    if (actionDataRows[i].creatorId == userId) {
                        userResponse = actionDataRows[i].columnValues;
                        let userResponseLength = Object.keys(userResponse).length;
                        for (let j = 1; j <= userResponseLength; j++) {
                            if (Utils.isJson(userResponse[j]) == true) {
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
                                    if (userResponseAns[0] == option.name) {
                                        userResponseAnswer = userResponseAns[0];
                                    }
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
                            correctAnsArr = correctResponseAns;
                        }
                    }
                }

                let optName = option.displayName;
                let optAttachmentId = option.attachments != 0 ? option.attachments[0].id : "";

                if (isRadio) {
                    let $radioOption = getRadioOptions(
                        optName,
                        question.name,
                        option.name,
                        userResponseAnswer,
                        correctAnswer,
                        optAttachmentId
                    );
                    $blankDiv.append($radioOption);
                } else {
                    let $checkOption = getCheckOptions(
                        optName,
                        question.name,
                        option.name,
                        userResponseAnswer,
                        correctAnswer,
                        optAttachmentId
                    );
                    $blankDiv.append($checkOption);
                }
                if (answerIs.toLowerCase() == "correct") {
                    optAnsArr[optind] = answerIs;
                } else if (answerIs.toLowerCase() == "incorrect") {
                    optAnsArr[optind] = "incorrect";
                }
                $questionDiv.find("#status-" + question.name).html(`<span class="semi-bold ${answerIs == "Correct" ? "text-success" : "text-danger"}">${answerIs}</span>`);
            });

            if (optAnsArr.includes("incorrect") != true) {
                score++;
            }
            $("div#root").append($questionDiv);
        });

    });

    let scorePercentage = (score / total) * 100;
    if (scorePercentage % 1 != 0) {
        scorePercentage = scorePercentage.tofixed(2);
    }
    Localizer.getString("score", ":").then(function(result) {
        $("#root > div.progress-section").after(UxUtils.getScoreContainer(result, scorePercentage));
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
function getRadioOptions(text, name, id, userResponse, correctAnswer, attachmentId) {
    let $oDiv = $(`<div class=""></div>`);
    /*  If answer is correct  and answered */
    if ($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) == $.trim(id)) {
        $oDiv.append(UxUtils.getRadioInnerResponderQuestionSuccess(id, text));
        if (answerIs == "") {
            answerIs = "Correct";
        }
    } else if (($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) != $.trim(userResponse))) {
        /* If User Response is correct and answered incorrect */
        $oDiv.append(UxUtils.getRadioInnerResponderQuestionCorrect(id, text));
        answerIs = "Incorrect";
    } else if (($.trim(userResponse) != $.trim(id) && $.trim(correctAnswer) == $.trim(id))) {
        /* If User Response is incorrect and not answered */
        $oDiv.append(UxUtils.getRadioInnerResponderQuestionCorrect2(id, text));
        answerIs = "Incorrect";
    } else {
        $oDiv.append(UxUtils.getRadioInnerResponderQuestionNormal(id, text));
    }

    if (attachmentId.length > 0) {
        let req = ActionHelper.getAttachmentInfo(actionId, attachmentId);
        ActionHelper.executeApi(req).then(function(response) {
                console.info("Attachment - Response: " + JSON.stringify(response));
                $oDiv.find("label.custom-radio").prepend(UxUtils.getOptionImageWithLoader(response.attachmentInfo.downloadUrl));
                Utils.getClassFromDimension(response.attachmentInfo.downloadUrl, `#${id} .opt-image:last`);
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error: " + JSON.stringify(error));
            });
    }
    return $oDiv;
}

/**
 * @desc Method for Question view Checkbox based on user id
 * @param text String contains correct and incorrect message
 * @param name String contains option name
 * @param id String contains option id
 * @param userResponse String contains user response data
 * @param correctAnswer String contains correct answer
 * @param attachmentId String contains attachment id of option
 */
function getCheckOptions(text, name, id, userResponse, correctAnswer, attachmentId) {
    let $oDiv = $(`<div class=""></div>`);
    /*  If answer is correct  and answered */
    if ($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) == $.trim(id)) {
        $oDiv.append(UxUtils.getCheckboxForInnerResponderQuestionSuccess(id, text));
        if (answerIs == "") {
            answerIs = "Correct";
        }
    } else if (($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) != $.trim(userResponse))) {
        /* If User Response is correct and answered incorrect */
        $oDiv.append(UxUtils.getCheckboxForInnerResponderQuestionCorrect(id, text));
        answerIs = "Incorrect";
    } else if (($.trim(userResponse) != $.trim(id) && $.trim(correctAnswer) == $.trim(id))) {
        /* If User Response is incorrect and not answered */
        $oDiv.append(UxUtils.getCheckboxForInnerResponderQuestionCorrect2(id, text));
        answerIs = "Incorrect";
    } else {
        $oDiv.append(UxUtils.getCheckboxForInnerResponderQuestionNormal(id, text));
    }

    if (attachmentId.length > 0) {
        let req = ActionHelper.getAttachmentInfo(actionId, attachmentId);
        ActionHelper.executeApi(req).then(function(response) {
                console.info("Attachment - Response: " + JSON.stringify(response));
                $oDiv.find("label.custom-check").prepend(UxUtils.getOptionImageWithLoader(response.attachmentInfo.downloadUrl));
                Utils.getClassFromDimension(response.attachmentInfo.downloadUrl, `#${id} .opt-image:last`);
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error: " + JSON.stringify(error));
            });
    }
    return $oDiv;
}

/**
 * @description Method for Question view based on user id
 * @param text String contains correct and incorrect message
 * @param name String contains option name
 * @param id String contains option id
 * @param userResponse String contains user response data
 * @param correctAnswer String contains correct answer
 * @param attachmentId String contains attachment id of option
 */
function getRadioOptionsCreator(text, optId, ind, result, attachmentId) {
    let $oDiv = $(`<div class="form-group"></div>`);
    /*  If answer is correct  and answered */
    if (result == "correct") {
        $oDiv.append(UxUtils.getCorrectRadiobox(optId, ind, text));
    } else {
        $oDiv.append(UxUtils.getRadioboxSimple(optId, ind, text));
    }
    if (attachmentId.length > 0) {
        let req = ActionHelper.getAttachmentInfo(actionId, attachmentId);
        ActionHelper.executeApi(req).then(function(response) {
                console.info("Attachment - Response: " + JSON.stringify(response));
                $oDiv.find("label.custom-radio").prepend(UxUtils.getOptionImageWithLoader(response.attachmentInfo.downloadUrl));
                Utils.getClassFromDimension(response.attachmentInfo.downloadUrl, `#${optId} .opt-image`);
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error: " + JSON.stringify(error));
            });
    }
    return $oDiv;
}

/**
 * @description Method for Question view based on user id
 * @param text String contains correct and incorrect message
 * @param name String contains option name
 * @param id String contains option id
 * @param userResponse String contains user response data
 * @param correctAnswer String contains correct answer
 * @param attachmentId String contains attachment id of option
 */
function getCheckOptionsCreator(text, optId, ind, result, attachmentId) {
    let $oDiv = $(`<div class="form-group"></div>`);
    /*  If answer is correct  and answered */
    if (result == "correct") {
        $oDiv.append(UxUtils.getCorrectCheckbox(optId, ind, text));
    } else {
        $oDiv.append(UxUtils.getCheckboxSimple(optId, ind, text));
    }
    if (attachmentId.length > 0) {
        let req = ActionHelper.getAttachmentInfo(actionId, attachmentId);
        ActionHelper.executeApi(req).then(function(response) {
            console.info("Attachment - Response: " + JSON.stringify(response));
            $oDiv.find("label.custom-check").prepend(UxUtils.getOptionImageWithLoader(response.attachmentInfo.downloadUrl));
            Utils.getClassFromDimension(response.attachmentInfo.downloadUrl, `#${optId} .opt-image`);
        }).catch(function(error) {
            console.error("AttachmentAction - Error: " + JSON.stringify(error));
        });
    }
    return $oDiv;
}

/**
 * @description Method for creating footer based on user id
 * @param userId String contains user identifier to load footer based on that
 */
function footer(userId) {
    $("div.question-content:first").find(".footer").hide();
    $("div.question-content").after(UxUtils.getFooterUserResultPage(userId, backKey));
}

/**
 * @description Method for footer for return back to landing page
 */
function footerClose() {
    $("#root").append(UxUtils.getFooterCloseArea(closeKey));
}

/**
 * @description Method for footer with download button
 */
function footerDownload() {
    $("#root").append(UxUtils.getFooterDownloadButton(downloadKey, downloadImageKey, downloadCSVKey));
}

/**
 * @description Method for footer for return back to landing page
 */
function footer1() {
    $("#root > div.card-box").append(UxUtils.getFooterBackDetailView(backKey));
}

/**
 * @description Method for footer for return back for internal pages
 */
function footerResponderNonResponderTabs() {
    $("div.question-content:visible").append(UxUtils.getFooterResNonResDetailView());
}

/**
 * @description Method to load non responder page
 */
function create_responder_nonresponders() {
    if (actionInstance.customProperties[2].value == "Only me") {
        if (actionContext.userId == actionInstance.creatorId) {
            $("#root").html("");
            if ($(".tabs-content:visible").length <= 0) {
                let $card1 = $(`<div class="card-box card-blank"></div>`);
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
            return false;
        }
    } else {
        $("#root").html("");
        if ($(".tabs-content:visible").length <= 0) {
            let $card1 = $(`<div class="card-box card-blank"></div>`);
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

/**
 * @description Method contains section to date change of quiz
 */
function changeDateSection() {
    $("#root .d-table:first").before(UxUtils.getChangeDateSection(changeDueDateKey, cancelKey, changeKey));
}

/**
 * @description Method contains section to close quiz
 */
function closeQuizSection() {
    $("#root .d-table:first").before(UxUtils.getCloseQuizSection(closeQuizKey, closeQuizConfirmKey, cancelKey, confirmKey));
}

/**
 * @description Method contains section to delete quiz
 */
function deleteQuizSection() {
    $("#root .d-table:first").before(UxUtils.deleteQuizSection(deleteQuizKey, deleteQuizConfirmKey, cancelKey, confirmKey));
}
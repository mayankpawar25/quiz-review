// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ActionHelper, Localizer } from "../common/ActionSdkHelper";
import { Constants } from "../common/utils/Constants";
import { UxUtils } from "./../common/utils/UxUtils";
import { Utils } from "./../common/utils/Utils";
import { KeyboardAccess } from "./../common/utils/KeyboardUtils";

// Fetching HTML Elements in Variables by ID.
let request;
let $root = "";
let row = {};
let actionInstance = null;
let isShowAnswerEveryQuestion = "";
let maxQuestionCount = 0;
let currentPage = 0;
let summaryAnswerResp = [];
let actionDataRows = null;
let actionDataRowsLength = 0;
let memberIds = [];
let myUserId = [];
let contextActionId;
let answerIs = "";
let questionKey = "";
let questionsKey = "";
let startKey = "";
let noteKey = "";
let choiceAnyChoiceKey = "";
let continueKey = "";
let answerResponseKey = "";
let correctKey = "";
let yourAnswerKey = "";
let incorrectKey = "";
let correctAnswerKey = "";
let yourAnswerIsKey = "";
let rightAnswerIsKey = "";
let submitKey = "";
let quizSummaryKey = "";
let doneKey = "";
let nextKey = "";
let backKey = "";
let checkKey = "";
let prevKey = "";
let quizExpiredKey = "";
let alreadyAttemptedKey = "";
let closeKey = "";

/* ********************************* Events ******************************************** */

/**
 * @event Click handles the radio is selcct as correct answer
 */
$(document).on("click", "div.radio-section", function() {
    radiobuttonclick();
});

/**
 * @event Click event handles next questions
 */
$(document).on("click", "#next", function() {
    let answerKeys = JSON.parse(actionInstance.customProperties[5].value);
    let correctAnsArr = [];
    let selectedAnswer = [];
    let checkCounter = 0;
    let correctAnswer = false;
    let attrName = "";
    let pagenumber = $(this).attr("data-next-id");
    currentPage = pagenumber;

    getStringKeys();

    if (parseInt(currentPage) > 0) {
        if ($("#previous").attr("data-prev-id") >= 0) {
            $("#previous").removeClass("disabled");
        }
        $("#previous").attr("data-prev-id", parseInt(currentPage) - 1);
    }

    /* Check if radio or checkbox is checked */
    let isChecked = false;
    $("div.card-box-question:visible").find("input[type='checkbox']:checked").each(function(ind, ele) {
        if ($(ele).is(":checked")) {
            checkCounter++;
            selectedAnswer.push($.trim($(ele).attr("id")));
            attrName = $(ele).attr("name");
            isChecked = true;
        }
    });

    $("div.card-box-question:visible").find("input[type='radio']:checked").each(function(ind, ele) {
        if ($(ele).is(":checked")) {
            checkCounter++;
            selectedAnswer.push($.trim($(ele).attr("id")));
            attrName = $(ele).attr("name");
            isChecked = true;
        }
    });

    if (isChecked == true) {
        isChecked = false;
        let ansRes = [];
        $.each(selectedAnswer, function(i, selectedSubarray) {
            if ($.inArray(selectedSubarray, answerKeys[(attrName - 1)]) !== -1) {
                ansRes.push("true");
            } else {
                ansRes.push("false");
            }
        });

        if ((answerKeys[(attrName - 1)].length == ansRes.length) && ($.inArray("false", ansRes) == -1)) {
            correctAnswer = true;
        } else {
            correctAnswer = false;
        }

        summaryAnswerResp.push(correctAnswer);

        $.each(answerKeys[(attrName - 1)], function(ii, subarr) {
            correctAnsArr.push($.trim($("#" + subarr).text()));
        });

        nextButtonName();
        if (isShowAnswerEveryQuestion == "Yes") {

            if ($(this).find("span").attr("class") == "check-key") {
                if (correctAnswer == true) {
                    $("div.card-box-question:visible").find(".result-status").html(UxUtils.getCorrectArea(correctKey));

                    $("input[type='radio']:visible, input[type='checkbox']:visible").each(function(optindex, opt) {
                        if ($(opt).is(":checked")) {
                            let optId = $(opt).attr("id");
                            $(opt).parents(".card-box").addClass("alert-success");
                            $(`div#${optId}`).find("div.pr--32.check-in-div").append(`
                                <i class="success-with-img">
                                    ${Constants.getSuccessTickIcon()}
                                </i>`);
                            $(`div#${optId}`).find("div.pr--32.check-in-div").addClass("mh--20");
                        }
                        $(opt).parents("div.card-box").addClass("disabled");
                    });
                } else {
                    $("div.card-box-question:visible").find(".result-status").html(UxUtils.getIncorrectArea(incorrectKey));

                    $("input[type='radio']:visible, input[type='checkbox']:visible").each(function(optindex, opt) {
                        $(opt).parents("div.card-box").addClass("disabled");
                        let optval = $(opt).attr("id");
                        let ansKey = [];
                        if (answerKeys[(attrName - 1)].indexOf(",") > -1) {
                            ansKey = answerKeys[(attrName - 1)].split(",");
                        } else {
                            ansKey = answerKeys[(attrName - 1)];
                        }
                        if ($(opt).is(":checked") && ansKey.includes(optval)) {
                            if ($(opt).parents("label.selector-inp").length > 0) {
                                $(opt).parents("label.selector-inp").find("div.check-in-div").append(UxUtils.getSuccessTick());
                                $(opt).parents("label.selector-inp").find("div.check-in-div").addClass("mh--20");
                            } else {
                                $(opt).parents("label.d-block").find("div.check-in-div").append(UxUtils.getSuccessTick());
                                $(opt).parents("label.d-block").find("div.check-in-div").addClass("mh--20");
                            }
                        } else if ($(opt).is(":checked") && ansKey.includes(optval) == false) {
                            $(opt).parents(".card-box").addClass("alert-danger");
                        } else if (ansKey.includes(optval)) {
                            if ($(opt).parents("label.selector-inp").length > 0) {
                                $(opt).parents("label.selector-inp").find("div.check-in-div").append(UxUtils.getSuccessTick());
                                $(opt).parents("label.selector-inp").find("div.check-in-div").addClass("mh--20");
                            } else {
                                $(opt).parents("label.d-block").find("div.check-in-div").append(UxUtils.getSuccessTick());
                                $(opt).parents("label.d-block").find("div.check-in-div").addClass("mh--20");

                            }
                        }
                    });
                }
                $(".check-key").addClass("next-key");
                $(".check-key").removeClass("check-key");
            } else {
                $root.find(".card-box-question").hide();
                if ((parseInt(currentPage) == $root.find("div.card-box-question").length) && (parseInt(currentPage)) < maxQuestionCount) {
                    createQuestionView();
                } else if (parseInt(currentPage) == maxQuestionCount) {
                    /*  Submit your question  */
                    let addDataRowRequest = ActionHelper.addDataRow(
                        getDataRow(contextActionId)
                    );
                    ActionHelper
                        .executeApi(addDataRowRequest)
                        .then(function(batchResponse) {
                            console.info("BatchResponse: " + JSON.stringify(batchResponse));
                            summarySection();
                        })
                        .catch(function(error) {
                            console.log("Error1: " + JSON.stringify(error));
                        });

                } else {
                    $("#previous").attr("data-prev-id", (parseInt(currentPage) - 1));
                    Localizer.getString("xofy", parseInt(currentPage) + 1, maxQuestionCount).then(function(result) {
                        $("#xofy").text(result);
                        nextButtonName();
                    });
                    $("#check").attr("data-next-id", (parseInt(currentPage) + 1));
                    $("#next").attr("data-next-id", (parseInt(currentPage) + 1));
                    $root.find("div.card-box-question:nth-child(" + (parseInt(currentPage) + 1) + ")").show();

                    if ($("div.card-box-question:nth-child(" + (parseInt(currentPage) + 1) + ")").find(".card-box.disabled:first").length == 0) {
                        if ($("div.card-box-question:nth-child(" + (parseInt(currentPage) + 1) + ")").find("input[name='" + (parseInt(currentPage) + 1) + "']").is(":checked") == false) {
                            $(".section-1-footer").find(".next-key").addClass("check-key");
                            $(".section-1-footer").find(".next-key").removeClass("next-key");
                            $(".section-1-footer").find(".check-key").text(checkKey);
                        }
                    }
                    if ($("#previous").attr("data-prev-id") >= 0) {
                        $("#previous").removeClass("disabled");
                    }
                }
            }

            if (currentPage >= maxQuestionCount) {
                $("#next").removeClass("disabled");
            }

        } else {
            $root.find(".card-box-question").hide();

            if ((parseInt(currentPage) == $root.find("div.card-box-question").length) && (parseInt(currentPage)) < maxQuestionCount) {
                createQuestionView();
            } else if (parseInt(currentPage) == maxQuestionCount) {
                /*  Submit your question  */
                let addDataRowRequest = ActionHelper.addDataRow(
                    getDataRow(contextActionId)
                );
                ActionHelper
                    .executeApi(addDataRowRequest)
                    .then(function(batchResponse) {
                        console.info("BatchResponse: " + JSON.stringify(batchResponse));
                        summarySection();
                    })
                    .catch(function(error) {
                        console.log("Error2: " + JSON.stringify(error));
                    });
            } else {
                $root.find(".card-box-question:nth-child(" + (parseInt(currentPage) + 1) + ")").show();
                $("#previous").attr("data-prev-id", (parseInt(currentPage) - 1));
                Localizer.getString("xofy", parseInt(currentPage) + 1, maxQuestionCount).then(function(result) {
                    $("#xofy").text(result);
                    nextButtonName();
                });
                $("#check").attr("data-next-id", (parseInt(currentPage) + 1));
                $("#next").attr("data-next-id", (parseInt(currentPage) + 1));
                if ($("#previous").attr("data-prev-id") >= 0) {
                    $("#previous").removeClass("disabled");
                }
                if ($("div.card-box-question:nth-child(" + (parseInt(currentPage) + 1) + ")").find(".card-box.disabled:first").length == 0) {
                    if ($("div.card-box-question:nth-child(" + (parseInt(currentPage) + 1) + ")").find("input[name='" + (parseInt(currentPage) + 1) + "']").is(":checked") == false) {
                        $(".section-1-footer").find(".next-key").addClass("check-key");
                        $(".section-1-footer").find(".next-key").removeClass("next-key");
                        $(".section-1-footer").find(".check-key").text(checkKey);
                    }
                }

            }

            if (currentPage >= maxQuestionCount) {
                $("#next").removeClass("disabled");
            }
        }

    } else {
        $(".choice-required-err").remove();
        $(".card-box-question:visible").append(UxUtils.getSelectChoiceOptionError(choiceAnyChoiceKey));
    }
});

/**
 * @event Change for radio or check box
 */
$(document).on("change", "input[type='radio'], input[type='checkbox']", function() {
    $(this).each(function(ind, opt) {
        if (isShowAnswerEveryQuestion == "Yes" && $("div.card-box:visible").find("label.custom-radio").hasClass("disabled") !== "disabled") {
            if ($(opt).is(":checked")) {
                $(".choice-required-err").remove();
                $(".check-key").parents("button").attr("id", "next");
                return false;
            } else {
                $(".choice-required-err").remove();
                $(".next-key").text(`${checkKey}`);
                $(".next-key").parents("button").attr("id", "check");
                return false;
            }
        } else {
            if ($(opt).is(":checked")) {
                $(".choice-required-err").remove();
                $(".check-key").text(`${nextKey}`);
                $(".check-key").parents("button").attr("id", "next");
                return false;
            }
        }
    });
});

/**
 * @event Click to check button
 */
$(document).on("click", "#check", function() {
    $(".choice-required-err").remove();
    $(".card-box-question").append(`<p class="mt--32 text-danger choice-required-err"><font>${choiceAnyChoiceKey}</font></p>`);
    $([document.documentElement, document.body]).animate({
        scrollTop: $(".text-danger:first").offset().top - 200
    }, 2000);
});

/**
 * @event Click handles previous questions
 */
$(document).on("click", "#previous", function() {
    if ($(this).hasClass("disabled") == false) {
        $(".check-key").addClass("next-key");
        $(".check-key").removeClass("check-key");
        $(".next-key").text(nextKey);
        $("#check").attr("id", "next");
        $(".choice-required-err").remove();

        let pagenumber = $(this).attr("data-prev-id");
        currentPage = pagenumber;
        getStringKeys();

        $root.find(".card-box-question").hide();
        $root.find(".card-box-question:nth-child(" + (parseInt(currentPage) + 1) + ")").show();
        $("#previous").attr("data-prev-id", (parseInt(currentPage) - 1));
        $("#next").attr("data-next-id", (parseInt(currentPage) + 1));
        $("#check").attr("data-next-id", (parseInt(currentPage) + 1));
        Localizer.getString("xofy", parseInt(currentPage) + 1, maxQuestionCount).then(function(result) {
            $("#xofy").text(result);
            nextButtonName();
        });

        if (currentPage <= 0) {
            $("#previous").addClass("disabled");
        }
    }
});

/**
 * @event Click event for finally close the quiz
 */
$(document).on("click", ".submit-key", function() {
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
 * @event Click Event on start button and loads first question
 */
$(document).on("click", "#start", function() {
    $root.html("");
    maxQuestionCount = actionInstance.dataTables[0].dataColumns.length;
    getStringKeys();
    createQuestionView();
});

/**
 * @event Click Event on submit quiz and loads summary view
 */
$(document).on("click", ".submit-form", function() {
    summarySection();
});

/**
 * @event Click Event to close
 */
$(document).on("click", "#close-event", function() {
    let closeViewRequest = ActionHelper.closeView();
    ActionHelper.executeApi(closeViewRequest);
});

/**
 * @event Keydown for disable action on response summary section
 */
KeyboardAccess.selectCheckOrRadioKeydown(document, ".summary-section input[type='radio'], .summary-section input[type='checkbox']");

/**
 * @event Click for disable action on response summary section
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return false;
        }
    }
}, ".summary-section input[type='radio'], .summary-section input[type='checkbox']");

/* ********************************* Methods ******************************************** */

/**
 * @description Async method for fetching localization strings
 */
async function getStringKeys() {
    Localizer.getString("question").then(function(result) {
        questionKey = result;
        $(".question-key").text(questionKey);
    });

    Localizer.getString("questions").then(function(result) {
        questionsKey = result;
        $(".question-key").text(questionsKey);
    });

    Localizer.getString("start").then(function(result) {
        startKey = result;
        $("#start").text(startKey);
    });

    Localizer.getString("note").then(function(result) {
        noteKey = result;
        $(".note-key").text(noteKey);
    });

    Localizer.getString("choose_any_choice").then(function(result) {
        choiceAnyChoiceKey = result;
    });

    Localizer.getString("continue").then(function(result) {
        continueKey = result;
    });

    Localizer.getString("answer_response").then(function(result) {
        answerResponseKey = result;
    });

    Localizer.getString("correct").then(function(result) {
        correctKey = result;
    });

    Localizer.getString("your_answer").then(function(result) {
        yourAnswerKey = result;
    });

    Localizer.getString("incorrect").then(function(result) {
        incorrectKey = result;
    });

    Localizer.getString("correctAnswer").then(function(result) {
        correctAnswerKey = result;
    });

    Localizer.getString("your_answer_is").then(function(result) {
        yourAnswerIsKey = result;
    });

    Localizer.getString("right_answer_is").then(function(result) {
        rightAnswerIsKey = result;
    });

    Localizer.getString("submit").then(function(result) {
        submitKey = result;
        $(".submit-key").text(submitKey);
    });

    Localizer.getString("quiz_summary").then(function(result) {
        quizSummaryKey = result;
    });

    Localizer.getString("next").then(function(result) {
        nextKey = result;
        $(".next-key").text(nextKey);
    });

    Localizer.getString("done").then(function(result) {
        doneKey = result;
        $(".next-key").text(doneKey);
    });

    Localizer.getString("back").then(function(result) {
        backKey = result;
        $(".back-key").text(backKey);
    });

    Localizer.getString("prev").then(function(result) {
        prevKey = result;
        $(".prev-key").text(prevKey);
    });

    Localizer.getString("check").then(function(result) {
        checkKey = result;
        $(".check-key").text(checkKey);
    });

    Localizer.getString("quiz_expired").then(function(result) {
        quizExpiredKey = result;
        $("#quiz-expired-key").text(backKey);
    });

    Localizer.getString("alreadyAttempted").then(function(result) {
        alreadyAttemptedKey = result;
        $(".already-attempt").html(alreadyAttemptedKey);
    });

    Localizer.getString("close").then(function(result) {
        closeKey = result;
        $(".close-key").text(closeKey);
    });
}

/**
 * @description Method to select theme based on the teams theme
 * @param request context request
 */
async function loadResponsView(request) {
    let response = await ActionHelper.executeApi(request);
    let context = response.context;
    $("form.section-1").show();
    let theme = context.theme;
    $("link#theme").attr("href", "css/style-" + theme + ".css");

    $("div.section-1").append(`<div class="row"><div class="col-12"><div id="root"></div></div></div>`);
    $("div.section-1 div.row").prepend(UxUtils.getQuizTemplateImageResponseView());
    $root = $("#root");

    setTimeout(() => {
        $("div.section-1").show();
        $("div.footer").show();
    }, 1000);

    OnPageLoad();
}

/* Initiate Method */
$(document).ready(function() {
    request = ActionHelper.getContextRequest();
    loadResponsView(request);
});

/**
 * @description Method loads the landing page
 */
function OnPageLoad() {
    ActionHelper
        .executeApi(request)
        .then(function(response) {
            myUserId = response.context.userId;
            contextActionId = response.context.actionId;
            getResponderIds(contextActionId);
        })
        .catch(function(error) {
            console.error("GetContext - Error4: " + JSON.stringify(error));
        });
}

/**
 * @description Method get Responder Details
 * @param action context id
 */
async function getResponderIds(actionId) {
    ActionHelper
        .executeApi(ActionHelper.requestDataRows(actionId))
        .then(function(batchResponse) {
            actionDataRows = batchResponse.dataRows;
            actionDataRowsLength = actionDataRows == null ? 0 : actionDataRows.length;
            if (actionDataRowsLength > 0) {
                for (let i = 0; i < actionDataRowsLength; i++) {
                    memberIds.push(actionDataRows[i].creatorId);
                }
            }
            getActionInstance(actionId);
        })
        .catch(function(error) {
            console.error("Console log: Error5: " + JSON.stringify(error));
        });
}

/**
 * @description Method get questions and options
 * @param action context id
 */
function getActionInstance(actionId) {
    ActionHelper
        .executeApi(ActionHelper.getActionRequest(actionId))
        .then(function(response) {
            actionInstance = response.action;
            createBody();
        })
        .catch(function(error) {
            console.error("Error6: " + JSON.stringify(error));
        });
}

/**
 * @description Method for creating the response view structure and initialize value
 */
function createBody() {
    /*  Check Expiry date time  */
    let currentTime = new Date().getTime();
    let expireTime = actionInstance.expiryTime;
    isShowAnswerEveryQuestion = actionInstance.customProperties[3].value;
    if (expireTime <= currentTime) {
        let $card = $(`<div class="card"></div>`);
        let $spDiv = $(`<div class="col-sm-12"></div>`);
        let $sDiv = $(`<div class="form-group" id="quiz-expired-key">${quizExpiredKey}</div>`);
        $card.append($spDiv);
        $spDiv.append($sDiv);
        $root.append($card);
        getStringKeys();
    } else {
        getStringKeys();
        let isImage = false;
        /* Loads all images when launching landing page */
        actionInstance.dataTables.forEach((dataTable, ind) => {
            if (dataTable.attachments.length > 0) {
                isImage = true;
                let req = ActionHelper.getAttachmentInfo(contextActionId, dataTable.attachments[0].id);
                ActionHelper.executeApi(req).then(function(response) {
                        actionInstance.dataTables[ind].attachments[0].url = response.attachmentInfo.downloadUrl;
                        if (actionInstance.dataTables[0].attachments[0].url != null) {
                            $(".quiz-template-image").attr("src", actionInstance.dataTables[0].attachments[0].url);
                            getClassFromDimension(response.attachmentInfo.downloadUrl, ".quiz-template-image");
                            $(".quiz-template-image").show();
                            $(".quiz-updated-img").show();
                            UxUtils.removeImageLoader(".quiz-template-image");
                        }
                        ActionHelper.hideLoader();

                    })
                    .catch(function(error) {
                        console.error("AttachmentAction - Errorquiz: " + JSON.stringify(error));
                    });
            }
            dataTable.dataColumns.forEach((questions, qindex) => {
                if (questions.attachments.length > 0) {
                    isImage = true;
                    let req = ActionHelper.getAttachmentInfo(contextActionId, questions.attachments[0].id);
                    ActionHelper.executeApi(req).then(function(response) {
                            actionInstance.dataTables[ind].dataColumns[qindex].attachments[0].url = response.attachmentInfo.downloadUrl;
                        })
                        .catch(function(error) {
                            console.error("AttachmentAction - Errorquestion: " + JSON.stringify(error));
                        });
                }

                questions.options.forEach((option, optindex) => {
                    if (option.attachments.length > 0) {
                        isImage = true;
                        let req = ActionHelper.getAttachmentInfo(contextActionId, option.attachments[0].id);
                        ActionHelper.executeApi(req).then(function(response) {
                                actionInstance.dataTables[ind].dataColumns[qindex].options[optindex].attachments[0].url = response.attachmentInfo.downloadUrl;
                            })
                            .catch(function(error) {
                                console.error("AttachmentAction - Erroroptions: " + JSON.stringify(error));
                            });
                    }
                });
            });
        });
        ActionHelper.hideLoader();

        let $card = $(`<div class=""></div>`);
        let $title = $(UxUtils.getQuizTitleResponseView(actionInstance.displayName));
        let $description = $(UxUtils.getQuizDescriptioneResponseView(actionInstance.customProperties[0].value));
        $card.append($title);
        $card.append($description);
        $root.append($card);
        let counter = actionInstance.dataTables[0].dataColumns.length;
        $root.append(textSection1);

        if ($.inArray(myUserId, memberIds) > -1) {
            $("p.text-description").before(UxUtils.getAlreadyAttempt(alreadyAttemptedKey));
            calculateScore();
            $(".body-outer").after(closeFooter);
        } else {
            if (counter > 1) {
                Localizer.getString("questions").then(function(result) {
                    Localizer.getString("totalQuestionQuiz", counter, result).then(function(res) {
                        $("div.text-counter-ques:last").find(".text-description").text(res);
                    });
                });
            } else {
                Localizer.getString("question").then(function(result) {
                    Localizer.getString("totalQuestionQuiz", counter, result).then(function(res) {
                        $("div.text-counter-ques:last").find(".text-description").text(res);
                    });
                });
            }
            $root.after(footerSection1);
        }
        getStringKeys();
        return;
    }
}

/**
 * @description Calculate User Score
 */
function calculateScore() {
    let total = 0;
    let score = 0;
    actionInstance.dataTables.forEach((dataTable) => {
        total = Object.keys(dataTable.dataColumns).length;
        /* Correct Answer */
        let correctResponse = JSON.parse(
            actionInstance.customProperties[5].value
        );

        for (let i = 0; i < actionDataRowsLength; i++) {
            if (actionDataRows[i].creatorId == myUserId) {
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

        let scorePercentage = 0;
        if (score > 0) {
            scorePercentage = (score / total) * 100;
        }
        if (scorePercentage % 1 != 0) {
            scorePercentage = scorePercentage.tofixed(2);
        }

        Localizer.getString("score", ":").then(function(result) {
            $("div.text-counter-ques:last").find(".text-description").html(`<p class="text-description bold">${result} ${scorePercentage}%</p>`);
        });
    });
}

/**
 * @description Method for creating Question
 */
function createQuestionView() {
    $(".footer.section-1-footer").remove();
    $root.after(paginationFooterSection);

    if (currentPage > 0) {
        if ($("#previous").attr("data-prev-id") >= 0) {
            $("#previous").removeClass("disabled");
        }
    } else {
        $("#previous").addClass("disabled");
    }

    $("#previous").attr("data-prev-id", (parseInt(currentPage) - 1));
    $("#next").attr("data-next-id", (parseInt(currentPage) + 1));
    $("#check").attr("data-next-id", (parseInt(currentPage) + 1));

    Localizer.getString("xofy", parseInt(currentPage) + 1, maxQuestionCount).then(function(result) {
        $("#xofy").text(result);
        nextButtonName();
    });

    actionInstance.dataTables.forEach((dataTable) => {
        let question = dataTable.dataColumns[currentPage];
        if ($(".quiz-img-sec").length > 0) {
            $(".quiz-img-sec").remove();
        }
        let count = parseInt(currentPage) + 1;
        $root.append(questionSection);
        $("#root div.card-box-question:visible .question-number-title").html(UxUtils.getQuestionNumberResponseView(questionKey, count));

        if (question.attachments.length > 0) {
            $("#root div.card-box-question:visible .question-template-image").attr("src", question.attachments[0].url);
            $("#root div.card-box-question:visible .question-template-image").show();
            $("#root div.card-box-question:visible .quiz-updated-img").show();
            getClassFromDimension(question.attachments[0].url, "#root div.card-box-question:visible .question-template-image");
            UxUtils.removeImageLoader("#root div.card-box-question:visible .question-template-image");
        }

        $("#root div.card-box-question:visible .question-title").html(`<p class="">${question.displayName}</p>`);
        let choiceOccurance = 1;
        /* Check multichoice or single choice options  */
        if (question.valueType == "SingleOption") {
            choiceOccurance = 1;
        } else {
            choiceOccurance = 2;
        }

        //add checkbox input
        if (question.valueType == "SingleOption") {
            //add radio input
            question.options.forEach((option) => {
                let displayName = option.displayName;
                let attachmentURL = option.attachments.length > 0 ? option.attachments[0].url : "";
                let $radioOption = getRadioButton(
                    displayName,
                    question.name,
                    option.name,
                    attachmentURL
                );
                $("div.card-box-question:visible > .option-sec").append($radioOption);
                getClassFromDimension(attachmentURL, "div.radio-section#" + option.name + " .opt-image");
                UxUtils.removeImageLoader("div.radio-section#" + option.name + " .opt-image");
            });
        } else {
            question.options.forEach((option) => {
                let displayName = option.displayName;
                let attachmentURL = option.attachments.length > 0 ? option.attachments[0].url : "";
                let $radioOption = getCheckboxButton(
                    displayName,
                    question.name,
                    option.name,
                    attachmentURL
                );
                $("div.card-box-question:visible > .option-sec").append($radioOption);
                getClassFromDimension(attachmentURL, "div.radio-section#" + option.name + " .opt-image");
                UxUtils.removeImageLoader("div.radio-section#" + option.name + " .opt-image");
            });
        }
    });
}

/**
 * @description Method for creating Radio button for single select type question
 * @param text label for radio button
 * @param name column id fo question
 * @param id unique identifier
 * @param attachmentId Attachment id for image
 */
function getRadioButton(text, name, id, attachmentURL) {
    let $cardBox = $(`<div class="card-box card-bg card-border mb--8"></div>`);
    $cardBox.append(UxUtils.getRadioResponseView(id, name, text));
    if (attachmentURL != "") {
        $cardBox.find(".custom-radio").prepend(UxUtils.getOptionImageWithLoader(attachmentURL));
    }
    return $cardBox;
}

/**
 * @descriptions Method for creating checkbox button for single select type question
 * @param text label for radio button
 * @param name column id fo question
 * @param id unique identifier
 * @param attachmentId Attachment id for image
 */
function getCheckboxButton(text, name, id, attachmentURL) {
    let $cardBox = $(`<div class="card-box card-bg card-border mb--8"></div>`);
    $cardBox.append(UxUtils.getCheckResponseView(id, name, text));

    if (attachmentURL != "") {
        $cardBox.find(".custom-check").prepend(UxUtils.getOptionImageWithLoader(attachmentURL));
    }
    return $cardBox;
}

/**
 * @description Method handles button text
 */
function nextButtonName() {
    let currentPage = $("#next").attr("data-next-id");
    if (parseInt(currentPage) >= maxQuestionCount) {
        setTimeout(function() {
            $(".section-1-footer").find(".next-key").text(`${doneKey}`);
        }, 100);
    } else {
        setTimeout(function() {
            $(".section-1-footer").find(".next-key").text(`${nextKey}`);
        }, 100);
    }
}

/**
 * @description Method creates Summary page after finish quiz
 */
function summarySection() {
    getStringKeys();
    $root.find(".card-box-question").hide();
    $("#root").append(summarySectionArea);
    let $mb16Div = $(`<div class="mb--16"></div>`);
    Localizer.getString("quiz_summary").then(function(result) {
        $mb16Div.prepend(`<h4>${result}</h4>`);
    });
    $(".summary-section").append($mb16Div);
    let $mb16Div2 = $(`<div class="mb--16"></div>`);
    $(".summary-section").append($mb16Div2);
    $("div.section-1").after(summaryFooter);
    $("div.container").find(".footer.section-1-footer").remove();

    let $cardQuestionDiv = $(`<div class="card-box-quest"></div>`);
    $(".summary-section").append($cardQuestionDiv);

    /*  Check Show Correct Answer  */
    if (Object.keys(row).length > 0) {
        let correctAnswer = $.parseJSON(actionInstance.customProperties[5].value);
        let score = 0;

        if (isShowAnswerEveryQuestion == "Yes") {
            $("#root").find("div.card-box-question").each(function(i, val) {
                let answerIs = $(val).find(".result-status span").hasClass("text-danger") ? "Incorrect" : "Correct";
                let cardQuestion = $(val).clone().show();
                $cardQuestionDiv.append(cardQuestion);
                if (answerIs == "Correct") {
                    score++;
                }
            });
            let scoreIs = (score / correctAnswer.length) * 100;
            if (scoreIs % 1 != 0) {
                scoreIs = scoreIs.tofixed(2);
            }
            Localizer.getString("score", ":").then(function(result) {
                $($mb16Div2).append(UxUtils.getScoreResponseView(result, scoreIs));
            });
        } else {
            let correctAnswer = $.parseJSON(actionInstance.customProperties[5].value);
            $("#root").find("div.card-box-question").each(function(i, val) {
                let cardQuestion = $(val).clone().show();
                $cardQuestionDiv.append(cardQuestion);
                let correctAnswerString = "";
                let userAnswerString = "";
                let userAnswerArray = row[i + 1];
                if ($(val).find(".option-sec input[type='radio']").length > 0) {
                    correctAnswerString = correctAnswer[i][0];
                    $(val).find(".option-sec input[type='radio']").each(function(optindex, opt) {
                        let optId = $(opt).attr("id");
                        if (correctAnswer[i].includes(optId)) {
                            $(cardQuestion).find("input[type='radio']#" + optId).parent("label.custom-radio").find(".check-in-div").append(`&nbsp;<i class="success-with-img">
                                ${Constants.getSuccessTickIcon()}
                            </i>`);
                        }
                    });
                } else {
                    correctAnswerString = correctAnswer[i].join(",");
                    $(val).find(".option-sec input[type='checkbox']").each(function(optindex, opt) {
                        let optId = $(opt).attr("id");
                        if (correctAnswer[i].includes(optId)) {
                            $(cardQuestion).find("input[type='checkbox']#" + optId).parent("label.custom-check").find(".check-in-div").append(`&nbsp;<i class="success-with-img">
                                ${Constants.getSuccessTickIcon()}
                            </i>`);
                        }
                    });
                }

                if (Utils.isJson(userAnswerArray)) {
                    userAnswerString = JSON.parse(userAnswerArray).join(",");
                } else {
                    userAnswerString = userAnswerArray;
                }

                if (correctAnswerString == userAnswerString) {
                    score++;
                    $(cardQuestion).find(".result-status").html(UxUtils.getCorrectArea(correctKey));
                } else {
                    $(cardQuestion).find(".result-status").html(UxUtils.getIncorrectArea(incorrectKey));
                }
            });
            let scoreIs = (score / correctAnswer.length) * 100;
            if (scoreIs % 1 != 0) {
                scoreIs = scoreIs.tofixed(2);
            }
            Localizer.getString("score", ":").then(function(result) {
                $($mb16Div2).append(UxUtils.getScoreResponseView(result, scoreIs));
            });
        }
        $(".summary-section").find(".option-sec .card-box").removeClass("alert-success");
    }
}

/**
 * @description Method for handle radio click event and returns saved object when user respond to quiz
 */
function radiobuttonclick() {
    let data = [];
    // row = {};
    $.each($("input[type='checkbox']:checked"), function(ind, v) {
        if ($(this).is(":visible")) {
            let col = $(this).parents("div.radio-section").attr("columnid");
            data.push($(this).attr("id"));

            if (!row[col]) {
                row[col] = [];
            }
            row[col] = JSON.stringify(data);
        }
    });

    $.each($("input[type='radio']:checked"), function() {
        if ($(this).is(":visible")) {
            let col = $(this).parents("div.radio-section").attr("columnid");

            if (!row[col]) {
                row[col] = [];
            }
            row[col] = $(this).attr("id");
        }
    });
}

/**
 * @description Method for fetching the reponse data from creation view
 * @param actionId contains context action id
 */
function getDataRow(actionId) {
    let data = {
        id: Utils.generateGUID(),
        actionId: actionId,
        dataTableId: "QuizDataSet",
        columnValues: row,
    };
    return data;
}

/**
 * @description Method to get image dimensions and image div dimensions
 * @param imageURL contains image url
 * @param selector contains image where url placed
 */
function getClassFromDimension(imgURL, selector) {
    let tmpImg = new Image();
    tmpImg.src = imgURL;
    let imgWidth = 0;
    let imgHeight = 0;
    $(tmpImg).on("load", function() {
        imgWidth = tmpImg.width;
        imgHeight = tmpImg.height;

        let divWidth = Math.round($(selector).width());
        let divHeight = Math.round($(selector).height());
        let getClass = "";
        if (imgHeight > divHeight) {
            /* height is greater than width */
            getClass = ("heightfit");
        } else if (imgWidth > divWidth) {
            /* width is greater than height */
            getClass = ("widthfit");
        } else {
            /* small image */
            getClass = ("smallfit");
        }
        $(selector).addClass(getClass);
    });
}

// *********************************************** HTML SECTION ***********************************************
/**
 * @description HTML section for landing page
 */
let textSection1 = UxUtils.getResponseLandingSection();

/**
 * @description HTML Footer section for start quiz
 */
let footerSection1 = UxUtils.getFooterResponseSection();

/**
 * @description HTML section for question area
 */
let questionSection = UxUtils.getResponseQuestionSection();

/**
 * @description HTML section for footer quiz area with pagination
 */
let paginationFooterSection = UxUtils.getPaginationFooterSection();

/**
 * @description HTML section for summary
 */
let summarySectionArea = UxUtils.getSummarySection();

/**
 * @description HTML section for summary footer
 */
let summaryFooter = UxUtils.getSummaryFooterSection();

/**
 * @description Variable contains close button at footer
 */
let closeFooter = UxUtils.getCloseFooterSection();
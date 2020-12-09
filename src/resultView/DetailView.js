import { ActionHelper, Localizer } from '../common/ActionSdkHelper';
import * as html2canvas from "html2canvas";

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
let request = ActionHelper.getContextRequest();
let dataResponse = '';
let actionId = '';
let root = document.getElementById("root");
let theme = '';
let isCreator = false;
let context= '';

let dueByKey = '';
let expiredOnKey = '';
let correctKey = '';
let incorrectKey = '';
let backKey = '';
let youKey = '';
let questionKey = '';
let scoreKey = '';
let closeKey = '';
let changeDueByKey = '';
let closeQuizKey = '';
let deleteQuizKey = '';
let downloadImageKey = '';
let downloadCSVKey = '';
let downloadKey = '';

/* ********************************* Events ******************************************** */

/**
 * @event Click Event for rerender the landing page
 */
$(document).on({
    click: function(e){
        createBody();
    },
    keydown: function(e){
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    }
}, '.back')

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
 * @event Click and Keydown Event for back to responder and non responder page
 */
$(document).on({
    click: function(e){
        let userId = $(this).attr("userid-data");
        create_responder_nonresponders();
    },
    keydown: function(e){
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    } 
}, '.back1');

/**
 * @event Click and Keydown Event for responder page
 */
$(document).on({
    click: function(e){
        create_responder_nonresponders();
    },
    keydown: function(e){
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    }
}, "#show-responders")

/**
 * @event Click and Keydown event fetching result of responders 
 */
$(document).on({
    click: function(e){
        let userId = $(this).attr("id");
        $("#root").html("");
        head();
        createQuestionView(userId);
        if ($(this).attr('data-attr') !== undefined) {
            footer2();
        } else {
            footer(userId);
        }
    },
    keydown: function(e){
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    }
}, ".getresult")


/**
 * @event Keydown event on responder and non-responders tab
 */
$(document).on({
    keydown: function(e) {
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    }
}, '.responder-key');

$(document).on({
    keydown: function (e) {
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    }
}, '.non-responder-key');

/**
 * @event Click event for download CSV
 */
$(document).on({
    keydown: function (e) {
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    },
    click: function(e){
        ActionHelper.downloadCSV(actionId, 'quiz');
    }
}, '#downloadCSV');


/**
 * @event Click event for download image in png
 */
$(document).on({
    keydown: function (e) {
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    },
    click: function (e) {
        let bodyContainerDiv = document.getElementsByClassName("container")[0];
        let backgroundColorOfResultsImage = theme;
        $('.footer').hide();
        html2canvas(bodyContainerDiv, {
            width: bodyContainerDiv.scrollWidth,
            height: bodyContainerDiv.scrollHeight,
            backgroundColor: backgroundColorOfResultsImage,
            useCORS: true,
        }).then((canvas) => {
            let fileName = 'quiz';
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
            $('.footer').show();
        });
    }
}, '#downloadImage');

/**
 * @event Click and Keydown event to show change due by date
 */
$(document).on({
    click: function (e) {
        $('.change-date').remove();
        $('.close-quiz').remove();
        $('.delete-quiz').remove();

        changeDateSection();

        let ddtt = ((actionInstance.customProperties[1].value).split('T'));
        let dt = ddtt[0].split('-');
        let weekDateFormat = new Date(dt[1]).toLocaleString('default', { month: 'short' }) + " " + dt[2] + ", " + dt[0];
        let timeData = new Date(actionInstance.expiryTime);
        let hourData = timeData.getHours();
        let minuteData = timeData.getMinutes();
        let currentTime = hourData + ':' + minuteData;
        $('.form_date input').val(weekDateFormat);
        $(".form_date").attr({ "data-date": weekDateFormat });
        $('.form_time').datetimepicker({
            language: 'en',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 1,
            minView: 0,
            maxView: 1,
            forceParse: 0
        });

        $('.form_time input').val(currentTime);

        let dateInput = $('input[name="expiry_date"]');
        let container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
        let options = {
            format: 'M dd, yyyy',
            container: container,
            todayHighlight: true,
            autoclose: true,
            orientation: 'top'
        };
        dateInput.datepicker(options);
    },
    keydown: function(e){
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    }
}, '.change-due-by-event');
/**
 * @event Click and Keydown event to show close quiz
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        $('.change-date').remove();
        $('.close-quiz').remove();
        $('.delete-quiz').remove();
        closeQuizSection();
        return false;
    },
    keydown: function(e) {
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    }
}, '.close-quiz-event')


/**
 * @event Click and Keydown event to show delete quiz
 */
$(document).on({
    click: function (e) {
        e.preventDefault();
        $('.change-date').remove();
        $('.close-quiz').remove();
        $('.delete-quiz').remove();
        deleteQuizSection();
        return false;
    },
    keydown: function (e) {
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    }
}, '.delete-quiz-event');

/**
 * @event Click event to close change, close and delete quiz confirm section
 */
$(document).on('click', '.cancel-question-delete', function() {
    $('.change-date').remove();
    $('.close-quiz').remove();
    $('.delete-quiz').remove();
});

/**
 * @event Click event for close dropdown lists
 */
$(document).on('click', '.threedots .dropdown-menu a', function(event) {
    $('.threedots .dropdown-menu').toggleClass('show');
});

/**
 * @event Click event for delete quiz
 */
$(document).on('click', '#delete-quiz', function() {
    ActionHelper.deleteActionInstance(actionId);
});

/**
 * @event Click event for change quiz expiry date
 */
$(document).on('click', '#change-quiz-question', function() {
    ActionHelper.closeActionInstance(actionId, actionInstance.version);
});

/**
 * @event Change event for expiry date and time
 */
$(document).on('change', "input[name='expiry_time'], input[name='expiry_date']", function() {
    $('#change-quiz-date').removeClass('disabled');
});

$(document).on('click', '#change-quiz-date', function(){
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
getTheme(request);

/**
 * @description Async method for fetching localization strings
 */
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

    Localizer.getString('close').then(function(result) {
        closeKey = result;
        $('.close-key').text(closeKey);
    });
    Localizer.getString('you').then(function(result) {
        youKey = result;
    });

    Localizer.getString('changeDueBy').then(function(result) {
        changeDueByKey = result
        $('.change-due-by-key').text(changeDueByKey);
    });

    Localizer.getString('closeQuiz').then(function(result) {
        closeQuizKey = result
        $('.close-quiz-key').text(closeQuizKey);
    });

    Localizer.getString('deleteQuiz').then(function(result) {
        deleteQuizKey = result
        $('.delete-quiz-key').text(deleteQuizKey);
    });

    Localizer.getString('download').then(function(result) {
        downloadKey = result;
        $('#download-key').html(downloadKey);
    });

    Localizer.getString('downloadImage').then(function(result) {
        downloadImageKey = result;
        $('#download-image-key').html(downloadImageKey);
    });

    Localizer.getString('downloadCSV').then(function(result) {
        downloadCSVKey = result;
        $('#download-csv-key').html(downloadCSVKey);
    });
}

/**
 * @description Method to select theme based on the teams theme  
 * @param request context request
 */

async function getTheme(request) {
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

    /*  Head Section  */
    if (myUserId == dataResponse.context.userId && myUserId == actionInstance.creatorId) {
        isCreator = true;
        headCreator();

        if (actionInstance.status == 'Closed') {
            $('.close-quiz-event').remove();
            $('.change-due-by-event').remove();
        }
        if (actionInstance.status == 'Expired') {
            $('.change-due-by-event').remove();
        }
    } else {
        head();
    }

    /*  Person Responded X of Y Responses  */
    getSubscriptionCount = ActionHelper.getSubscriptionMemberCount(
        actionContext.subscription
    );
    let response = await ActionHelper.executeApi(getSubscriptionCount);

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

    if (isCreator == true) {
        Localizer.getString('xofy_people_responded', actionSummary.rowCount, memberCount).then(function(result) {
            let xofy = result;
            $pcard.append(`<p class="date-color cursor-pointer mb--24"> <span id="show-responders" class="under-line" tabindex="0" role="button">${xofy}</span><!--<span class="pull-right send-reminder under-line"> Send reminder</span> --></p>`);
            $pcard.append(`<div class="clearfix"></div>`);
        });
    } else {
        Localizer.getString('xofy_people_responded', actionSummary.rowCount, memberCount).then(function(result) {
            let xofy = result;
            $pcard.append(`<p class="date-color mb--24"><span id="show-responders">${xofy}</span></p>`);
            $pcard.append(`<div class="clearfix"></div>`);
        });
    }


    $("#root").append($pcard);
    let responderDateLength = Object.keys(ResponderDate).length;
    if (responderDateLength > 0) {
        if (myUserId == dataResponse.context.userId && myUserId == actionInstance.creatorId) {
            createCreatorQuestionView();
        } else if (myUserId == dataResponse.context.userId && myUserId != actionInstance.creatorId) {
            let isResponded = false;
            ResponderDate.forEach((responder) => {
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
                        let initials = matches.join('').substring(0, 2); // DPR
                        Localizer.getString('you_yet_respond').then(function(result) {
                            $('div.progress-section').after(`<div class="d-flex cursor-pointer" id="${nonresponders.value2}">
                                        <div class="avtar">
                                            ${initials}
                                        </div>
                                        <div class="avtar-txt">${result}</div>
                                    </div>
                                `);
                            $('div.progress-section').after(`<hr class="small">`);
                            $('div#' + nonresponders.value2).after(`<hr class="small">`);
                        });
                    }
                });
            }
        } else {
            ResponderDate.forEach((responder) => {
                if (responder.value2 == myUserId) {
                    createReponderQuestionView(myUserId, responder);
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
                    let initials = matches.join('').substring(0, 2); // DPR
                    Localizer.getString('you_yet_respond').then(function(result) {
                        $('div.progress-section').after(`<div class="d-flex cursor-pointer" id="${nonresponders.value2}">
                                <div class="avtar">
                                    ${initials}
                                </div>
                                <div class="avtar-txt">${result}</div>
                            </div>
                        `);
                        $('div.progress-section').after(`<hr class="small">`);
                        $('div#' + nonresponders.value2).after(`<hr class="small">`);
                    });
                }
            }
        })
    }

    if (isCreator == true) {
        if (context.hostClientType == 'web') {
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

    let $card = $('<div class=""></div>');


    let $title_sec = $(`<h4 class="mb--8">${title}</h4>`);
    let $description_sec = $(`<p class="mb--8 text-justify text-break font-12">${description}</p>`);

    let current_timestamp = new Date().getTime();

    let $date_sec = $(`<p class="semi-bold mb--16 font-12">${actionInstance.expiryTime > current_timestamp ? dueByKey+' ' : expiredOnKey+' '} ${dueby}</p>`);

    $card.append($title_sec);
    $card.append($description_sec);
    $card.append($date_sec);
    $("#root").append($card);

    if (actionInstance.customProperties[4].value.length > 0) {
        let req = ActionHelper.getAttachmentInfo(actionId, actionInstance.customProperties[4].value);
        ActionHelper.executeApi(req).then(function(response) {
                $card.prepend(`
                    <div class="quiz-updated-img max-min-220 card-bg card-border cover-img upvj cursur-pointer mb--16 bg-none bdr-none">
                        <img src="${response.attachmentInfo.downloadUrl}" class="image-responsive quiz-template-image smallfit"  crossorigin="anonymous">
                    </div>
                `);
                getClassFromDimension(response.attachmentInfo.downloadUrl, '.quiz-template-image');
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

    let $card = $('<div class=""></div>');

    let $titleDiv = $(`<div class="d-table mb--8"></div>`);
    let $title_sec = $(`<label class="font-12 "><h4>${title}</h4></label>`);
    let $creatorButtons = $(`
            <label class="float-right font-12 bold" id="status-1"><span class="semi-bold">
                <div class="threedots dropdown">
                    <button type="button" class="btn btn-tpt btn-plain dropdown-toggle" data-toggle="dropdown" tabindex="0" role="button">
                        <svg role="presentation" focusable="false" viewBox="8 8 16 16" class=""><g class="ui-icon__filled"><circle cx="22" cy="16" r="2"></circle><circle cx="16" cy="16" r="2"></circle><circle cx="10" cy="16" r="2"></circle></g><g class="ui-icon__outline cw"><circle cx="22" cy="16" r="1.5"></circle><circle cx="16" cy="16" r="1.5"></circle><circle cx="10" cy="16" r="1.5"></circle></g></svg>
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item change-due-by-event" tabindex="0" role="button">
                            <svg width="16" height="16" viewBox="8 8 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.8203 13.5C14.0599 13.5 14.2995 13.5391 14.5391 13.6172C14.7839 13.6953 15.0026 13.8099 15.1953 13.9609C15.388 14.1068 15.5443 14.2839 15.6641 14.4922C15.7891 14.7005 15.8516 14.9375 15.8516 15.2031C15.8516 15.4375 15.7943 15.6615 15.6797 15.875C15.5651 16.0885 15.4167 16.2682 15.2344 16.4141C15.4167 16.5807 15.5651 16.776 15.6797 17C15.7943 17.224 15.8516 17.4609 15.8516 17.7109C15.8516 17.9766 15.7917 18.2214 15.6719 18.4453C15.5573 18.6641 15.4036 18.8542 15.2109 19.0156C15.0182 19.1771 14.7995 19.3021 14.5547 19.3906C14.3151 19.4792 14.0703 19.5234 13.8203 19.5234C13.513 19.5234 13.2109 19.4714 12.9141 19.3672C12.6224 19.2578 12.3646 19.0938 12.1406 18.875L12.8438 18.1641C12.9792 18.2839 13.1302 18.375 13.2969 18.4375C13.4688 18.4948 13.6432 18.5234 13.8203 18.5234C13.9349 18.5234 14.0521 18.5052 14.1719 18.4688C14.2969 18.4323 14.4089 18.3802 14.5078 18.3125C14.6068 18.2396 14.6875 18.1536 14.75 18.0547C14.8177 17.9557 14.8516 17.8411 14.8516 17.7109C14.8516 17.5495 14.8099 17.4167 14.7266 17.3125C14.6484 17.2083 14.5469 17.125 14.4219 17.0625C14.2969 17 14.1615 16.9583 14.0156 16.9375C13.8698 16.9115 13.7318 16.8984 13.6016 16.8984V15.8984C13.7161 15.8984 13.8438 15.8906 13.9844 15.875C14.1302 15.8594 14.2656 15.8281 14.3906 15.7812C14.5208 15.7292 14.6302 15.6589 14.7188 15.5703C14.8073 15.4766 14.8516 15.3542 14.8516 15.2031C14.8516 15.0781 14.8177 14.9714 14.75 14.8828C14.6823 14.7943 14.5964 14.7214 14.4922 14.6641C14.388 14.6068 14.276 14.5651 14.1562 14.5391C14.0365 14.513 13.9245 14.5 13.8203 14.5C13.6953 14.5 13.5729 14.5234 13.4531 14.5703C13.3385 14.6172 13.2318 14.6771 13.1328 14.75L12.375 14.1016C12.4583 14.0026 12.5573 13.9167 12.6719 13.8438C12.7865 13.7656 12.9062 13.7031 13.0312 13.6562C13.1615 13.6042 13.2943 13.5651 13.4297 13.5391C13.5651 13.513 13.6953 13.5 13.8203 13.5ZM19.4531 19.5H18.4531V15.1406L17.9062 15.4766L17.3828 14.625L19.4531 13.3438V19.5ZM22.9844 11.5C22.9844 11.2969 22.9427 11.1068 22.8594 10.9297C22.7812 10.7474 22.6719 10.5885 22.5312 10.4531C22.3958 10.3125 22.237 10.2031 22.0547 10.125C21.8776 10.0417 21.6875 10 21.4844 10H18.9922V9C18.9922 8.86458 18.9427 8.7474 18.8438 8.64844C18.7448 8.54948 18.6276 8.5 18.4922 8.5C18.3568 8.5 18.2396 8.54948 18.1406 8.64844C18.0417 8.7474 17.9922 8.86458 17.9922 9V10H13.9922V9C13.9922 8.86458 13.9427 8.7474 13.8438 8.64844C13.7448 8.54948 13.6276 8.5 13.4922 8.5C13.3568 8.5 13.2396 8.54948 13.1406 8.64844C13.0417 8.7474 12.9922 8.86458 12.9922 9V10H10.4844C10.2865 10 10.0964 10.0417 9.91406 10.125C9.73177 10.2031 9.57031 10.3125 9.42969 10.4531C9.29427 10.5885 9.1849 10.7474 9.10156 10.9297C9.02344 11.112 8.98438 11.3021 8.98438 11.5V20.9141C8.98438 21.0703 9.00781 21.224 9.05469 21.375C9.10156 21.526 9.17708 21.6615 9.28125 21.7812C9.44271 21.974 9.6849 22.138 10.0078 22.2734C10.3307 22.4036 10.6979 22.5156 11.1094 22.6094C11.526 22.6979 11.9661 22.7682 12.4297 22.8203C12.8984 22.8724 13.3542 22.9115 13.7969 22.9375C14.2396 22.9635 14.6536 22.9818 15.0391 22.9922C15.4245 22.9974 15.7396 23 15.9844 23C16.2344 23 16.5495 22.9974 16.9297 22.9922C17.3151 22.9818 17.7292 22.9635 18.1719 22.9375C18.6146 22.9115 19.0677 22.875 19.5312 22.8281C20 22.776 20.4401 22.7057 20.8516 22.6172C21.2682 22.5234 21.638 22.4089 21.9609 22.2734C22.2839 22.138 22.526 21.974 22.6875 21.7812C22.7917 21.6615 22.8672 21.526 22.9141 21.375C22.9609 21.224 22.9844 21.0703 22.9844 20.9141V11.5ZM21.9844 20.9141C21.9844 21.0391 21.9089 21.151 21.7578 21.25C21.612 21.3438 21.4141 21.4297 21.1641 21.5078C20.9193 21.5807 20.6354 21.6432 20.3125 21.6953C19.9896 21.7474 19.6536 21.7943 19.3047 21.8359C18.9609 21.8724 18.6146 21.901 18.2656 21.9219C17.9167 21.9427 17.5911 21.9609 17.2891 21.9766C16.987 21.987 16.7214 21.9948 16.4922 22C16.263 22 16.0938 22 15.9844 22C15.875 22 15.7057 22 15.4766 22C15.2474 21.9948 14.9818 21.987 14.6797 21.9766C14.3776 21.9609 14.0521 21.9427 13.7031 21.9219C13.3542 21.901 13.0052 21.8724 12.6562 21.8359C12.3125 21.7943 11.9792 21.7474 11.6562 21.6953C11.3333 21.6432 11.0469 21.5807 10.7969 21.5078C10.5521 21.4297 10.3542 21.3438 10.2031 21.25C10.0573 21.151 9.98438 21.0391 9.98438 20.9141V11.5C9.98438 11.3646 10.0339 11.2474 10.1328 11.1484C10.2318 11.0495 10.349 11 10.4844 11H12.9922V12C12.9922 12.1354 13.0417 12.2526 13.1406 12.3516C13.2396 12.4505 13.3568 12.5 13.4922 12.5C13.6276 12.5 13.7448 12.4505 13.8438 12.3516C13.9427 12.2526 13.9922 12.1354 13.9922 12V11H17.9922V12C17.9922 12.1354 18.0417 12.2526 18.1406 12.3516C18.2396 12.4505 18.3568 12.5 18.4922 12.5C18.6276 12.5 18.7448 12.4505 18.8438 12.3516C18.9427 12.2526 18.9922 12.1354 18.9922 12V11H21.4844C21.6198 11 21.737 11.0495 21.8359 11.1484C21.9349 11.2474 21.9844 11.3646 21.9844 11.5V20.9141Z" fill="#484644"/>
                            </svg><span class="change-due-by-key">${changeDueByKey}</span>
                        </a>
                        <a class="dropdown-item close-quiz-event" tabindex="0" role="button">
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">
                                <rect fill="none" width="16" height="16"/>
                                <path id="Path_1" fill="#484644" d="M8.091,1c0.634-0.002,1.266,0.083,1.876,0.253c0.594,0.165,1.163,0.407,1.694,0.72
                                    c1.047,0.626,1.923,1.501,2.548,2.549c0.313,0.53,0.555,1.1,0.721,1.693c0.337,1.228,0.337,2.523,0,3.751
                                    c-0.166,0.594-0.408,1.163-0.721,1.694c-0.619,1.052-1.496,1.929-2.548,2.548c-0.531,0.313-1.101,0.555-1.694,0.72
                                    c-1.228,0.338-2.523,0.338-3.751,0c-0.593-0.165-1.163-0.407-1.694-0.72c-1.057-0.613-1.936-1.491-2.549-2.548
                                    c-0.313-0.531-0.555-1.101-0.72-1.694c-0.337-1.228-0.337-2.523,0-3.751c0.166-0.594,0.407-1.163,0.72-1.693
                                    c0.62-1.053,1.497-1.93,2.549-2.549c0.531-0.313,1.1-0.555,1.693-0.72C6.826,1.083,7.457,0.998,8.091,1z M8.091,2.092
                                    c-0.8-0.005-1.592,0.157-2.327,0.476c-1.437,0.62-2.582,1.767-3.2,3.205c-0.318,0.73-0.48,1.521-0.475,2.318
                                    c-0.001,0.696,0.12,1.388,0.356,2.042c0.239,0.655,0.59,1.265,1.037,1.8l8.444-8.443C10.848,2.594,9.492,2.101,8.091,2.092z
                                    M4.253,12.7c0.536,0.446,1.145,0.798,1.8,1.037c0.655,0.236,1.346,0.356,2.042,0.355c0.797,0.006,1.587-0.156,2.319-0.475
                                    c1.438-0.618,2.585-1.763,3.205-3.2c0.318-0.734,0.479-1.526,0.475-2.327c-0.006-1.402-0.499-2.758-1.394-3.838L4.253,12.7z"/>
                            <span class="close-quiz-key">${closeQuizKey}</span>
                        </a>
                        <a class="dropdown-item delete-quiz-event" tabindex="0" role="button">
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">
                                <rect x="-1.352" y="1.773" fill="none" width="16" height="16"/>
                                <rect fill="none" width="16" height="16"/>
                                <path id="Path_586" fill="#484644" d="M11.502,4.001c0.197-0.001,0.392,0.041,0.57,0.125c0.355,0.16,0.64,0.444,0.8,0.8
                                    c0.083,0.179,0.126,0.373,0.125,0.57v8.554c0.009,0.294-0.079,0.582-0.25,0.82c-0.177,0.228-0.4,0.414-0.656,0.547
                                    c-0.286,0.148-0.591,0.259-0.905,0.328c-0.338,0.077-0.68,0.136-1.023,0.172c-0.339,0.036-0.664,0.06-0.977,0.069
                                    c-0.313,0.011-0.58,0.014-0.8,0.009h-0.9c-0.354,0.005-0.73-0.005-1.133-0.031c-0.4-0.026-0.801-0.075-1.199-0.147
                                    c-0.368-0.064-0.728-0.172-1.07-0.32c-0.299-0.132-0.564-0.326-0.781-0.57c-0.203-0.245-0.31-0.557-0.3-0.875v-8.55
                                    C3,5.305,3.04,5.111,3.119,4.931c0.079-0.178,0.19-0.339,0.327-0.477c0.138-0.139,0.3-0.25,0.478-0.328
                                    C4.105,4.042,4.303,4,4.502,4.001H11.502z M7.002,13.001h-1v-6h1V13.001z M4.502,5.001c-0.274,0.004-0.496,0.226-0.5,0.5v8.554
                                    c0.004,0.154,0.083,0.297,0.211,0.383c0.164,0.116,0.346,0.203,0.539,0.258c0.243,0.072,0.491,0.127,0.742,0.164
                                    c0.271,0.042,0.533,0.073,0.789,0.095c0.255,0.021,0.488,0.034,0.699,0.039c0.219,0.005,0.379,0.007,0.48,0.007h1.078
                                    c0.109,0,0.268-0.002,0.476-0.008c0.209-0.006,0.442-0.019,0.7-0.039c0.261-0.021,0.524-0.049,0.789-0.086
                                    c0.249-0.037,0.493-0.092,0.733-0.164c0.196-0.059,0.381-0.148,0.548-0.266c0.13-0.085,0.209-0.229,0.211-0.383V5.501
                                    c-0.004-0.274-0.226-0.496-0.5-0.5H4.502z M10.002,13.001h-1v-6h1V13.001z M8.002,0.001c0.215,0.002,0.43,0.025,0.641,0.07
                                    C8.87,0.11,9.088,0.185,9.291,0.291c0.197,0.094,0.37,0.231,0.508,0.4c0.139,0.172,0.209,0.389,0.2,0.609v0.702h3
                                    c0.276,0.002,0.499,0.227,0.497,0.503c-0.001,0.131-0.053,0.256-0.145,0.349c-0.092,0.095-0.218,0.148-0.35,0.148h-10
                                    C2.87,3.003,2.743,2.949,2.651,2.854c-0.193-0.19-0.196-0.501-0.006-0.694c0.002-0.002,0.004-0.004,0.006-0.006
                                    C2.742,2.056,2.87,2.001,3.002,2.001h3v-0.7C5.995,1.079,6.069,0.861,6.21,0.689c0.136-0.168,0.307-0.304,0.5-0.4
                                    c0.205-0.104,0.425-0.178,0.651-0.218C7.573,0.027,7.788,0.004,8.002,0.001z M8.002,1.001c-0.084,0.001-0.167,0.006-0.25,0.016
                                    c-0.102,0.005-0.202,0.021-0.3,0.047C7.36,1.085,7.271,1.116,7.186,1.159C7.11,1.194,7.045,1.251,7,1.322v0.679h2v-0.7
                                    c-0.054-0.064-0.123-0.115-0.2-0.148C8.715,1.111,8.625,1.08,8.534,1.06C8.444,1.039,8.352,1.025,8.26,1.021
                                    C8.174,1.009,8.088,1.003,8.002,1.001z"/>
                            </svg>  
                            <span class="delete-quiz-key">${deleteQuizKey}</span>
                        </a>
                    </div>
                </div>     
            </span></label>
        `);
    let $description_sec = $(`<p class="mb--8 text-justify text-break font-12">${description}</p>`);

    let current_timestamp = new Date().getTime();
    let $date_sec = $(`<p class="semi-bold mb--16 font-12">${actionInstance.expiryTime > current_timestamp ? dueByKey + ' ' : expiredOnKey + ' '} ${dueby}</p>`);

    $titleDiv.append($title_sec);
    $titleDiv.append($creatorButtons);
    $card.append($titleDiv);
    $card.append($description_sec);
    $card.append($date_sec);
    $("#root").append($card);

    if (actionInstance.customProperties[4].value.length > 0) {
        let req = ActionHelper.getAttachmentInfo(actionId, actionInstance.customProperties[4].value);
        ActionHelper.executeApi(req).then(function(response) {
                $card.prepend(`
                    <div class="quiz-updated-img max-min-220 card-bg card-border cover-img upvj cursur-pointer mb--16 bg-none bdr-none">
                        <img src="${response.attachmentInfo.downloadUrl}" class="image-responsive quiz-template-image smallfit"  crossorigin="anonymous">
                    </div>
                `);
                getClassFromDimension(response.attachmentInfo.downloadUrl, '.quiz-template-image');
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
    ResponderDate = [];
    actionNonResponders = [];
    if (actionDataRowsLength > 0) {
        for (let i = 0; i < actionDataRowsLength; i++) {
            memberIds.push(actionDataRows[i].creatorId);
            let requestResponders = ActionHelper.getSusbscriptionMembers(
                actionContext.subscription, [actionDataRows[i].creatorId]
            ); // ids of responders

            let responseResponders = await ActionHelper.executeApi(requestResponders);
            let perUserProfile = responseResponders.members;
            ResponderDate.push({
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
                `<tr id="${ResponderDate[itr].value2}" class="getresult cursor-pointer" tabindex="0" rol="button">
                    <td>
                        <div class="d-flex ">
                            <div class="avtar">
                                ${initials}
                            </div>
                            <div class="avtar-txt">${name}</div>
                        </div>
                    </td>
                    <td  class="text-right date-text">
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

        /* Correct Answer */
        let correctResponse = JSON.parse(
            actionInstance.customProperties[5].value
        );

        for (let i = 0; i < actionDataRowsLength; i++) {
            if (actionDataRows[i].creatorId == userId) {
                for (let c = 0; c < correctResponse.length; c++) {
                    let correctAnsString = '';
                    let userAnsString = '';
                    if ($.isArray(correctResponse[c])) {
                        if (correctResponse[c].length > 1) {
                            correctAnsString = correctResponse[c].join(',');
                        } else {
                            correctAnsString = correctResponse[c][0];
                        }
                    } else {
                        correctAnsString = correctResponse[c];
                    }

                    if (ActionHelper.isJson(actionDataRows[i].columnValues[c + 1])) {
                        let responderAnsArr = JSON.parse(actionDataRows[i].columnValues[c + 1]);
                        if (responderAnsArr.length > 1) {
                            userAnsString = responderAnsArr.join(',');
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
    let score_is = (score / total) * 100;
    if (score_is % 1 != 0) {
        score_is = score_is.tofixed(2);
    }
    return score_is;
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

/**
 * @description Method to creat4e responder correct and incorrect quiz responses  
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

        Localizer.getString('you_responded').then(function(result) {
            $('div.progress-section').after(`<div class="d-flex cursor-pointer getresult" data-attr="home" id="${myUserId}">
                    <div class="avtar">
                        ${initials}
                    </div>
                    <div class="avtar-txt">${result}</div>
                </div>
                <hr class="small">`);
            $('div.progress-section').after(`<hr class="small">`);
            $('div#' + myUserId).after(`<hr class="small">`);
        });
    }

    actionInstance.dataTables.forEach((dataTable) => {
        total = Object.keys(dataTable.dataColumns).length;

        dataTable.dataColumns.forEach((question, ind) => {
            answerIs = "";
            let $cardDiv = $('<div class="card-box card-bg card-border alert-success mb--8"></div>');
            let $questionContentDiv = $('<div class="question-content disabled2"></div>');
            let $rowdDiv = $('<div class="mt--24"></div>');
            let $dflexDiv = $('<div class="d-table mb--8"></div>');
            $questionContentDiv.append($rowdDiv);
            $questionContentDiv.append($dflexDiv);
            let count = ind + 1;
            let $questionHeading = $(`<label class="font-12"></label>`);
            $questionHeading.append(
                `<strong class="question-title semi-bold"><span  class="question-number">Question # ${count}</span></strong></label> </strong>`
            );
            $questionHeading.append(`<label class="float-right" id="status-1 "></label>`);

            $dflexDiv.append($questionHeading);

            $dflexDiv.append(`<div class="">
                    <div class="semi-bold font-14 mb--16 ">${question.displayName}</div>
                </div>`);

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
                            if (ActionHelper.isJson(userResponse[j])) {
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

                let $radioOption = getOptions(
                    optName,
                    question.name,
                    option.name,
                    userResponseAnswer,
                    correctAnswer,
                    optAttachmentId
                );
                $cardDiv.append($radioOption);

                if (answerIs.toLowerCase() == 'correct') {
                    optAnsArr[optind] = answerIs;
                } else {
                    optAnsArr[optind] = 'incorrect';
                }
            });
            $cardDiv.find("#status-" + question.name).html(`<span class="${answerIs == 'Correct' ? 'text-success' : 'text-danger'}">${answerIs == 'Correct' ? correctKey : incorrectKey}</span>`);
            if (optAnsArr.includes('incorrect') == false) {
                score++;
            }
            $("#root").append($cardDiv);
        });
    });
    $("#root").append('<div class="ht-100"></div>');
    let scorePercentage = (score / total) * 100;
    if (scorePercentage % 1 != 0) {
        scorePercentage = scorePercentage.tofixed(2);
    }

    Localizer.getString("score", ":").then(function(result) {
        $("#root > hr.small:last").after(`<div class="d-flex"><p class="semi-bold font-14">${result} ${scorePercentage}%</p></div>`);
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

    Localizer.getString('aggregrateResult').then(function(result) {
        $('div.progress-section').after(`
            <div class="clearfix"></div>
            <hr class="small">
            <div class="d-flex cursor-pointer" data-attr="home" id="${myUserId}">
                <p class="semi-bold font-14">${result}</p>
            </div>
            <hr class="small">
        `);
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
            let $mtDiv = $(`<div class="mt--24"></div>`);
            let $dflexDiv = $('<div class="d-table mb--8"></div>');

            $quesContDiv.append($mtDiv);
            $('#root').append($quesContDiv);
            let count = ind + 1;
            let attachmentId = question.attachments != "" ? question.attachments[0].id : "";

            $dflexDiv.append(`<label class="font-12 ">
                    <strong class="question-title semi-bold "> 
                        <span  class="question-number font-12 bold">${questionKey} # ${count}</span>
                    </strong>
                </label>`);
            $dflexDiv.append(`<label class="float-right font-12 bold" id="status-${question.name}"> </label>`);
            $mtDiv.append($dflexDiv);
            let $blankQDiv = $(`<div class=""></div>`);
            $mtDiv.append($blankQDiv);
            $blankQDiv.append(`
                    <div class="semi-bold font-16 mb--16">${question.displayName}</div>
            `);
            let questionAttachmentId = question.attachments.length > 0 ? question.attachments[0].id : '';
            if (questionAttachmentId.length > 0) {
                let req = ActionHelper.getAttachmentInfo(actionId, attachmentId);
                ActionHelper.executeApi(req).then(function(response) {
                        console.info("Attachment - Response: " + JSON.stringify(response));
                        $blankQDiv.prepend(`
                            <div class="option-image-section cover-img min-max-132 mb--4"> 
                                <img src="${response.attachmentInfo.downloadUrl} " class="question-image img-responsive"  crossorigin="anonymous">
                            </div>`);
                        getClassFromDimension(response.attachmentInfo.downloadUrl, `#content-${question.name} img.question-image`);
                    })
                    .catch(function(error) {
                        console.error("AttachmentAction - Error: " + JSON.stringify(error));
                    });
            }

            if (attachmentId.length > 0) {
                let req = ActionHelper.getAttachmentInfo(actionId, attachmentId);
                ActionHelper.executeApi(req).then(function(response) {
                        console.info("Attachment - Response: " + JSON.stringify(response));
                        $mtDiv.find('d-table').after(`
                            <div class="quiz-updated-img cover-img min-max-132 mb--8">
                                <img src="${response.attachmentInfo.downloadUrl}" class="image-responsive question-template-image"  crossorigin="anonymous">
                            </div>`);
                        getClassFromDimension(response.attachmentInfo.downloadUrl, `#content-${question.name} img.question-template-image`);
                    })
                    .catch(function(error) {
                        console.error("AttachmentAction - Error: " + JSON.stringify(error));
                    });
            }
            let correctAnswerCounter = 0;
            let resResult = [];
            scoreArray[question.name] = 0;

            /* check for correct answer for each users */
            for (let i = 0; i < actionDataRowsLength; i++) {
               
                for (let c = 0; c < correctResponse.length; c++) {
                    let correctAnsString = '';
                    let userAnsString = '';
                    if ($.isArray(correctResponse[c])) {
                        if (correctResponse[c].length > 1) {
                            correctAnsString = correctResponse[c].join(',');
                        } else {
                            correctAnsString = correctResponse[c][0];
                        }
                    } else {
                        correctAnsString = correctResponse[c];
                    }

                    if (ActionHelper.isJson(actionDataRows[i].columnValues[count])) {
                        let responderAnsArr = JSON.parse(actionDataRows[i].columnValues[count]);
                        if (responderAnsArr.length > 1) {
                            userAnsString = responderAnsArr.join(',');
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

            question.options.forEach((option, iii) => {
                /* User Responded */
                let $cardDiv = $('<div class="card-box card-bg card-border mb--8 "></div>');
                let userResponse = [];
                let userResponseAnswer = "";
                for (let i = 0; i < actionDataRowsLength; i++) {
                    userResponse = actionDataRows[i].columnValues;
                    let userResponseLength = Object.keys(userResponse).length;
                    let userResArr = [];
                    for (let j = 1; j <= userResponseLength; j++) {
                        if (ActionHelper.isJson(userResponse[j])) {
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
                /* if (result == 'correct')
                    $cardDiv.addClass("alert-success"); */

                $quesContDiv.append($cardDiv);
            });


            if (actionDataRowsLength == 0) {
                $dflexDiv.find("#status-" + question.name).html(`<span class="semi-bold">0% Correct</div>`);
            } else {
                let aggregrateQuestionScore = ((scoreArray[question.name] * 100) / actionDataRowsLength);
                if (aggregrateQuestionScore % 1 != 0) {
                    aggregrateQuestionScore = aggregrateQuestionScore.toFixed(2);
                }
                $dflexDiv.find("#status-" + question.name).html(`<span class="semi-bold">${aggregrateQuestionScore}% Correct</span>`);
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
            let $mtDiv = $(`<div class="mt--24"></div>`);
            let $dtableDiv = $(`<div class="d-table mb--8 "></div>`);
            let count = ind + 1;
            let questionAttachmentId = question.attachments != "" ? question.attachments[0].id : "";

            $questionDiv.append($mtDiv);
            $mtDiv.append($dtableDiv);
            $dtableDiv.append(`<label class="font-12">
                    <strong class="question-title semi-bold"> 
                        <span  class="question-number font-12 bold">${questionKey} # ${count}</span>
                    </strong>
                </label>`);

            $dtableDiv.append(`<label class="float-right font-12 bold" id="status-${question.name}"></label>`);

            let $blankQDiv = $(`<div class=""></div>`);
            $mtDiv.append($blankQDiv);
            $blankQDiv.append(`
                    <div class="semi-bold font-16 mb--16 ">${question.displayName}</div>
            `);

            if (questionAttachmentId.length > 0) {
                let req = ActionHelper.getAttachmentInfo(actionId, questionAttachmentId);
                ActionHelper.executeApi(req).then(function(response) {
                        console.info("Attachment - Response: " + JSON.stringify(response));
                        $blankQDiv.prepend(`
                            <div class="option-image-section cover-img min-max-132 mb--4"> 
                                <img src="${response.attachmentInfo.downloadUrl} " class="question-image img-responsive"  crossorigin="anonymous">
                            </div>`);
                        getClassFromDimension(response.attachmentInfo.downloadUrl, `#content-${question.name} img.question-image`);
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
                            if (ActionHelper.isJson(userResponse[j]) == true) {
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
                let optAttachmentId = option.attachments != 0 ? option.attachments[0].id : "";

                let $radioOption = getOptions(
                    optName,
                    question.name,
                    option.name,
                    userResponseAnswer,
                    correctAnswer,
                    optAttachmentId
                );

                $blankDiv.append($radioOption);
                if (answerIs.toLowerCase() == 'correct') {
                    optAnsArr[optind] = answerIs;
                } else if (answerIs.toLowerCase() == 'incorrect') {
                    optAnsArr[optind] = 'incorrect';
                }
                $questionDiv.find("#status-" + question.name).html(`<span class="semi-bold ${answerIs == 'Correct' ? 'text-success' : 'text-danger'}">${answerIs}</span>`);
            });

            if (optAnsArr.includes('incorrect') != true) {
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
        $("#root > div.progress-section").after(`<div class="d-flex"><p class="semi-bold pr--8">${result} ${scorePercentage}%</p></div>`);
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
        $oDiv.append(
            `<div class="card-box card-bg card-border alert-success mb--8">
                <div class="radio-section custom-radio-outer" id="${id} " columnid="3 ">
                    <label class="custom-radio d-block font-14">
                        <span class="radio-block selected "></span>
                        <div class="pr--32 check-in-div">${text}  &nbsp;
                            <i class="success-with-img"> 
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                                    <defs>
                                        <clipPath id="clip-Custom_Size_1">
                                        <rect width="16" height="16"/>
                                        </clipPath>
                                    </defs>
                                    <g id="Custom_Size_1" data-name="Custom Size – 1" clip-path="url(#clip-Custom_Size_1)">
                                        <rect width="16" height="16" fill="none"/>
                                        <path id="Path_1" data-name="Path 1" d="M16.026,0a.535.535,0,0,1,.392.165.535.535,0,0,1,.165.392.535.535,0,0,1-.165.392L7.23,10.136a.546.546,0,0,1-.783,0l-5.29-5.29a.546.546,0,0,1,0-.783.546.546,0,0,1,.783,0l4.9,4.889,8.8-8.787A.535.535,0,0,1,16.026,0Z" transform="translate(-0.787 2.475)" />
                                    </g>
                                </svg>
                            </i> 
                        </div>
                    </label>
                </div>
            </div>`
        );
        if (answerIs == "") {
            answerIs = "Correct";
        }
    } else if (($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) != $.trim(userResponse))) {
        /* If User Response is correct and answered incorrect */
        $oDiv.append(`<div class="card-box card-bg card-border alert-danger mb--8">
                <div class="radio-section custom-radio-outer" id="${id}">
                    <label class="custom-radio d-block selected font-14  "> 
                        <span class="radio-block selected"></span>
                        <div class="pr--32 check-in-div">
                        ${text}
                        </div>
                    </label>
                </div>
            </div>`);
        answerIs = "Incorrect";
    } else if (($.trim(userResponse) != $.trim(id) && $.trim(correctAnswer) == $.trim(id))) {
        /* If User Response is incorrect and not answered */
        $oDiv.append(`<div class="card-box card-bg card-border mb--8">
                <div class="radio-section custom-radio-outer" id="${id}">
                    <label class="custom-radio d-block selected font-14">
                        <span class="radio-block"></span>
                        <div class="pr--32 check-in-div">${text} &nbsp;
                            <i class="success-with-img">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                                    <defs>
                                        <clipPath id="clip-Custom_Size_1">
                                        <rect width="16" height="16"/>
                                        </clipPath>
                                    </defs>
                                    <g id="Custom_Size_1" data-name="Custom Size – 1" clip-path="url(#clip-Custom_Size_1)">
                                        <rect width="16" height="16" fill="none"/>
                                        <path id="Path_1" data-name="Path 1" d="M16.026,0a.535.535,0,0,1,.392.165.535.535,0,0,1,.165.392.535.535,0,0,1-.165.392L7.23,10.136a.546.546,0,0,1-.783,0l-5.29-5.29a.546.546,0,0,1,0-.783.546.546,0,0,1,.783,0l4.9,4.889,8.8-8.787A.535.535,0,0,1,16.026,0Z" transform="translate(-0.787 2.475)" />
                                    </g>
                                </svg>
                            </i>
                         </div>
                    </label>
                </div>
            </div>`);
        answerIs = "Incorrect";
    } else {
        $oDiv.append(`<div class="card-box card-bg card-border mb--8 ">
                <div class=" radio-section custom-radio-outer " id="${id}" columnid="3 ">
                    <label class="custom-radio d-block font-14"> 
                        <span class="radio-block"></span><div class="pr--32 check-in-div">${text}</div>
                    </label>
                </div>
            </div>`);
    }

    if (attachmentId.length > 0) {
        let req = ActionHelper.getAttachmentInfo(actionId, attachmentId);
        ActionHelper.executeApi(req).then(function(response) {
                console.info("Attachment - Response: " + JSON.stringify(response));
                $oDiv.find('label.custom-radio').prepend(`
                    <div class="option-image-section cover-img min-max-132 mb--4"> 
                        <img src="${response.attachmentInfo.downloadUrl} " class="opt-image img-responsive"  crossorigin="anonymous">
                    </div>`);
                getClassFromDimension(response.attachmentInfo.downloadUrl, `#${id} .opt-image:last`);
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
function getOptionsCreator(text, optId, ind, result, attachmentId) {
    let $oDiv = $('<div class="form-group"></div>');
    /*  If answer is correct  and answered */
    if (result == 'correct') {
        $oDiv.append(`
                <div class="radio-section custom-radio-outer " id="${optId}" columnid="${ind}">
                    <label class="custom-radio d-block font-14 cursor-pointer ">
                        <span class="radio-block"></span>
                        <div class="pr--32 check-in-div">${text} &nbsp;
                            <i class="success"> 
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                                    <defs>
                                        <clipPath id="clip-Custom_Size_1">
                                        <rect width="16" height="16"/>
                                        </clipPath>
                                    </defs>
                                    <g id="Custom_Size_1" data-name="Custom Size – 1" clip-path="url(#clip-Custom_Size_1)">
                                        <rect width="16" height="16" fill="none"/>
                                        <path id="Path_1" data-name="Path 1" d="M16.026,0a.535.535,0,0,1,.392.165.535.535,0,0,1,.165.392.535.535,0,0,1-.165.392L7.23,10.136a.546.546,0,0,1-.783,0l-5.29-5.29a.546.546,0,0,1,0-.783.546.546,0,0,1,.783,0l4.9,4.889,8.8-8.787A.535.535,0,0,1,16.026,0Z" transform="translate(-0.787 2.475)" />
                                    </g>
                                </svg>
                            </i>
                        </div>
                    </label>
                </div>
            `);
    } else {
        $oDiv.append(`
                <div class="radio-section custom-radio-outer " id="${optId}" columnid="${ind}">
                    <label class="custom-radio d-block font-14 cursor-pointer ">
                        <span class="radio-block"></span>
                        <div class="pr--32 check-in-div">${text}</div>
                    </label>
                </div>
            `);
    }
    if (attachmentId.length > 0) {
        let req = ActionHelper.getAttachmentInfo(actionId, attachmentId);
        ActionHelper.executeApi(req).then(function(response) {
                console.info("Attachment - Response: " + JSON.stringify(response));
                $oDiv.find('label.custom-radio').prepend(`
                    <div class="option-image-section cover-img min-max-132 mb--4"> 
                        <img src="${response.attachmentInfo.downloadUrl} " class="opt-image img-responsive"  crossorigin="anonymous">
                    </div>`);
                getClassFromDimension(response.attachmentInfo.downloadUrl, `#${optId} .opt-image`);
            })
            .catch(function(error) {
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
    $("div.question-content:first").find('.footer').hide();
    $("div.question-content").after(`
        <div class="footer">
            <div class="footer-padd bt">
                <div class="container">
                    <div class="row">
                        <div class="col-9 d-table">
                            <a class="cursor-pointer back1 d-table-cell" userid-data="${userId}" id="hide2">
                                <span tabindex="0" role="button">
                                    <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="back-btn">
                                        <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                        </path>
                                        <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                        </path>
                                    </svg> <span class="back-key">${backKey}</span>
                                </span>
                            </a>
                        </div>
                        <div class="col-3">&nbsp;</div>
                    </div>
                </div>
            </div>
        </div>`);
}

/**
 * @description Method for footer for return back to landing page
 */
function footerClose() {
    $("#root").append(
        `<div class="footer">
            <div class="footer-padd bt">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-right"> 
                            <button type="button" class="btn btn-primary btn-sm pull-right close-key" id="closeKey"> ${closeKey}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    );
}

/**
 * @description Method for footer with download button
 */
function footerDownload() {
    $("#root").append(
        `<div class="footer">
            <div class="footer-padd bt">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-right">
                            <div class="dropdown btn-group">
                                <button type="button" class="btn btn-primary  dd-btn" id="downloadImage"  data-toggle="dropdown" data-bind="enable: !noResults()">
                                    <span class="span1 add-content-label" id="download-key">${downloadKey}</span>   
                                </button>
                                <button type="button" class="btn btn-primary   dropdown-toggle dd-btn" data-toggle="dropdown" aria-expanded="false">
                                        <span class="span2">
                                        <svg role="presentation" fill="#fff" width="16" height="16" focusable="false" viewBox="8 5 16 16" ><path class="ui-icon__outline cw" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z"></path><path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z"></path></svg>
                                    </span>    
                                </button>
                                <ul class="dropdown-menu" style="top:22px">
                                    <li class="cursur-pointer" id="downloadImage">
                                    <a id="add-text" tabindex="0" role="button">
                                        <span class="text-label" id="download-image-key">${downloadImageKey}</span></a>
                                    </li>
                                    <li class="cursur-pointer" id="downloadCSV">
                                        <a id="add-photo" tabindex="0" role="button">
                                            <span class="photo-label" id="download-csv-key">${downloadCSVKey}</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    );
}

/**
 * @description Method for footer for return back to landing page
 */
function footer1() {
    $("#root > div.card-box").append(
        `<div class="footer">
            <div class="footer-padd bt">
                <div class="container">
                    <div class="row">
                        <div class="col-9 d-table">
                            <a class="cursor-pointer back d-table-cell" id="hide2">
                                <span tabindex="0" role="button">
                                    <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="back-btn">
                                        <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                        </path>
                                        <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                        </path>
                                    </svg> <span class="back-key">${backKey}</span>
                                </span>
                            </a>
                        </div>
                        <div class="col-3">&nbsp;</div>
                    </div>
                </div>
            </div>
        </div>`
    );
}

/**
 * @description Method for footer for return back for internal pages
 */
function footer2() {
    $("div.question-content:visible").append(
        `<div class="footer">
            <div class="footer-padd bt">
                <div class="container">
                    <div class="row">
                        <div class="col-9">
                            <a class="cursor-pointer back" id="hide2">
                                <span tabindex="0" role="button">
                                    <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="back-btn">
                                        <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                        </path>
                                        <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                        </path>
                                    </svg> <span class="back-key">${backKey}</span>
                                </span>
                            </a>
                        </div>
                        <div class="col-3"><button class="btn btn-tpt">&nbsp;</button></div>
                    </div>
                </div>
            </div>
        </div>`
    );
}

/**
 * @description Method to load non responder page 
 */
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
    $(tmpImg).on('load', function() {
        imgWidth = tmpImg.width;
        imgHeight = tmpImg.height;
        let divWidth = Math.round($(selector).width());
        let divHeight = Math.round($(selector).height());
        let getClass = '';
        if (imgHeight > divHeight) {
            /* height is greater than width */
            getClass = ('heightfit');
        } else if (imgWidth > divWidth) {
            /* width is greater than height */
            getClass = ('widthfit');
        } else {
            /* small image */
            getClass = ('smallfit');
        }
        $(selector).addClass(getClass);

    });
}

/**
 * @description Method contains section to date change of quiz
 */
function changeDateSection() {
    $('#root .d-table:first').before(`
        <div class="change-date">
            <div class="card-box card-bg card-border">
                <div class="row">
                    <div class="col-sm-12">
                        <h4 class="mb--8"><strong class="due-by-key bold">Change due date</strong></h4>
                    </div>
                    <div class="clearfix"></div>
                    <div class="col-6 pr--4">
                        <div class="input-group date form_date" data-date="1979-09-16T05:25:07Z" data-date-format="M dd, yyyy" data-link-field="dtp_input1">
                            <input class="form-control in-t" size="16" name="expiry_date" type="text" value="" readonly>
                        </div>
                    </div>
                    <div class="col-6 pl--4">
                        <div class="input-group date form_time" data-date="" data-date-format="hh:ii" data-link-field="dtp_input3" data-link-format="hh:ii">
                            <input class="form-control in-t" name="expiry_time" size="16" type="text" value="" readonly>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="d-flex-alert mt--16 mb--8">
                            <div class="pr--8">
                                <label class="confirm-box text-danger"> </label>
                            </div>
                            <div class=" pl--8 text-right">
                                <button type="button" class="btn btn-primary-outline btn-sm cancel-question-delete mr--8">Cancel</button><button type="button" class="btn btn-primary btn-sm disabled" id="change-quiz-date">Change</button>
                            </div>
                        </div>
                    </div>

                    <div class="clearfix"></div>

                </div>
            </div>
        </div>
    `);
}

/**
 * @description Method contains section to close quiz
 */
function closeQuizSection() {
    $('#root .d-table:first').before(`
        <div class="close-quiz">
            <div class="card-box card-bg card-border">
                <div class="row">
                    <div class="col-sm-12">
                        <h4 class="mb--8"><strong class="due-by-key bold">Close Quiz</strong></h4>
                    </div>
                    <div class="clearfix"></div>


                    <div class="col-12">
                        <div class="d-flex-alert mt--16 mb--8">
                            <div class="pr--8">
                                <label class="confirm-box text-danger">Are you sure you want to close this survey? </label>
                            </div>
                            <div class=" pl--8 text-right">
                                <button type="button" class="btn btn-primary-outline btn-sm cancel-question-delete mr--8">Cancel</button><button type="button" class="btn btn-primary btn-sm" id="change-quiz-question">Confirm</button>
                            </div>

                        </div>
                    </div>

                    <div class="clearfix"></div>

                </div>
            </div>
        </div>
    `);
}

/**
 * @description Method contains section to delete quiz
 */
function deleteQuizSection() {
    $('#root .d-table:first').before(`
        <div class="delete-quiz">
            <div class="card-box card-bg card-border">
                <div class="row">
                    <div class="col-sm-12">
                        <h4 class="mb--8"><strong class="due-by-key bold">Delete Quiz</strong></h4>
                    </div>
                    <div class="clearfix"></div>


                    <div class="col-12">
                        <div class="d-flex-alert mt--16 mb--8">
                            <div class="pr--8">
                                <label class="confirm-box text-danger">Are you sure you want to delete this Quiz? </label>
                            </div>
                            <div class=" pl--8 text-right">
                                <button type="button" class="btn btn-primary-outline btn-sm cancel-question-delete mr--8">Cancel</button><button type="button" class="btn btn-primary btn-sm" id="delete-quiz">Confirm</button>
                            </div>

                        </div>
                    </div>

                    <div class="clearfix"></div>

                </div>
            </div>
        </div>
    `);
}
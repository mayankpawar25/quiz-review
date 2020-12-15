// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Localizer, ActionHelper } from "./../common/ActionSdkHelper";
import { UxUtils } from "../common/utils/UxUtils";
import { Constants } from "../common/utils/Constants";
import { KeyboardAccess } from "../common/utils/KeyboardUtils";
import { Utils } from "../common/utils/Utils";

let request;
let questionCount = 0;
let questions = new Array();
let settingText = "";
let quesContainer = "";
let opt = "";
let lastSession = "";

let optionKey = "";
let addMoreOptionsKey = "";
let choicesKey = "";
let questionTitleKey = "";
let checkMeKey = "";
let nextKey = "";
let backKey = "";
let requiredKey = "";
let dueByKey = "";
let resultVisibleToKey = "";
let resultEveryoneKey = "";
let resultMeKey = "";
let correctAnswerKey = "";
let everyoneKey = "";
let onlyMeKey = "";
let showCorrectAnswerKey = "";
let answerCannotChangeKey = "";
let invalidDateTimeKey = "";
let sureDeleteThisKey = "";
let okKey = "";
let cancelKey = "";
let forQuizAtleastOneQuestionKey = "";
let maxTenOptionKey = "";
let atLeastTwoOptionsRequiredKey = "";
let selectCorrectChoiceKey = "";
let addQuestionKey = "";
let uploadCoverImageKey = "";
let attachmentSet = [];
let coverImageKey = "";
let clearKey = "";
let invalidFileFormatKey = "";
let questionLeftBlankKey = "";

/* ******************************** Events ************************************** */
/**
 * @event Keydown for add Question Section
 */
KeyboardAccess.keydownClick(document, "#add-questions");

/**
 * @event Click for add Question Section
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        let questionCounter;
        $(this).parents("div.container").before(quesContainer.clone());

        $(".section-2").find(".question-required-err").remove();
        $(".section-2").find(".confirm-box").remove();

        Localizer.getString("option", "").then(function(result) {
            $(".opt-cls").attr("placeholder", result);
        });

        $("div.container").each(function(ind, el) {
            $(el).find("div.option-div > div.input-group > input[type='text']")
                .each(function(index, elem) {
                    let counter = index + 1;
                    $(elem).attr({
                        placeholder: optionKey,
                    });
                    $(elem).attr({ id: "option" + counter });
                    $(elem)
                        .parents(".option-div")
                        .find("input[type='file']")
                        .attr({ id: "option-image-" + counter });
                    $(elem)
                        .parents(".option-div")
                        .find("input.form-check-input")
                        .attr({ id: "check" + counter });

                });
        });

        Localizer.getString("enterTheQuestion").then(function(result) {
            $("div.container").find("#question-title").attr({ "placeholder": result });
        });

        $("div.question-container:visible").each(function(index, elem) {
            questionCounter = index + 1;
            $(elem)
                .find("span.question-number")
                .text("Question # " + questionCounter);
            $(elem).find("input[name='question_image']").attr({ id: "question-image-" + questionCounter });
            $(elem).attr({ id: "question" + questionCounter });
        });
        questionCount++;
        $(".check-me").text(checkMeKey);
        $(".check-me-title").attr({ "title": checkMeKey });
        $(".add-options").html(`
        ${Constants.getPlusIcon()} ${addMoreOptionsKey}`);

        /* Focus to last question input */
        $("#question" + questionCounter + " #question-title").focus();
        return false;
    }
}, "#add-questions");

/**
 * @event Click for cancel button on confirm box of question deletion
 */
$(document).on("click", ".cancel-question-delete", function() {
    $(this).parents(".question-container").find(".add-options").show();
    $(this).parents(".confirm-box").remove();
});

/**
 * @event Keydown for remove the Question from the section-2
 */
KeyboardAccess.keydownClick(document, ".remove-question");

/**
 * @event Click for remove the Question from the section-2
 */
$(document).on({
    click: function(e) {
        let element = $(this);
        $(this).parents(".question-container").find(".confirm-box").remove();
        $(this).parents(".question-container").find(".question-required-err").remove();

        if ($("div.question-container:visible").length > 1) {
            $(this).parents(".question-container").find(".add-options").hide();
            $(this).parents(".question-container").find(".form-group-opt").after(`
            <div class="confirm-box">
                <div class="clearfix"></div>
                <div class="d-flex-alert  mb--8">
                    <div class="pr--8">
                        <label class="confirm-box text-danger"> ${sureDeleteThisKey} </label>
                    </div>
                    <div class="pl--8 text-right">
                        <button type="button" class="btn btn-primary-outline btn-sm cancel-question-delete mr--8">${cancelKey}</button>
                        <button type="button" class="btn btn-primary btn-sm" id="delete-question">${okKey}</button>
                    </div>
                </div>
            </div>
        `);

            $([document.documentElement, document.body]).animate({
                scrollTop: $(this).parents(".question-container").find(".confirm-box").offset().top - Constants.getWidthOffsets()
            }, Constants.setIntervalTimeThousand());

            $(this).parents(".question-container").find(".confirm-box #delete-question").focus();

            $(document).on("click", "#delete-question", function() {
                $(this).parents("div.question-container").remove();
                let questionCounter;
                $("div.question-container:visible").each(function(index, elem) {
                    questionCounter = index + 1;
                    $(elem).find("span.question-number").text("Question # " + questionCounter);
                    $(elem).find("input[name='question_image']").attr({ id: "question-image-" + questionCounter });
                    $(elem).attr({ id: "question" + questionCounter });
                });
            });
        } else {
            $(this).parents("div.question-container")
                .find("div.d-flex-ques")
                .after(`<label class="text-danger d-block question-required-err"><font class="mb--4 d-block">${forQuizAtleastOneQuestionKey}</font></label>`);

            $([document.documentElement, document.body]).animate({
                scrollTop: $(".text-danger.d-block:first").offset().top - Constants.getWidthOffsets()
            }, );
        }
    }
}, ".remove-question");

/**
 * @event Keydown to add the Option under question
 */
KeyboardAccess.keydownClick(document, ".add-options");

/**
 * @event Click to add the Option under question
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        if ($(this).parents("div#options").find("div.option-div input[type='text'][id^=option]").length >= Constants.getOptionLimit()) {
            $(this).parents(".question-container").find(".add-options").hide();
            $(this).parents(".question-container").find(".add-options").after(`
                <div class="max-option-err-box"> ${maxTenOptionKey} </div>
            `);

            $([document.documentElement, document.body]).animate({
                scrollTop: $(this).parents(".question-container").find(".max-option-err-box").offset().top - Constants.getWidthOffsets()
            }, Constants.setIntervalTimeThousand());
            return false;
        }
        $(this).parents(".container").find("div.option-div:last").after(opt.clone());

        let selector = $(this).parents("div.container");
        let counter = 0;
        $(selector)
            .find("div.option-div div.input-group input[type='text']")
            .each(function(index, elem) {
                counter = index + 1;
                $(elem).attr({
                    placeholder: optionKey,
                });
                $(elem).attr({ id: "option" + counter });
                $(elem)
                    .parents(".option-div")
                    .find("input[type='file']")
                    .attr({ id: "option-image-" + counter });
                $(elem)
                    .parents(".option-div")
                    .find("input.form-check-input")
                    .attr({ id: "check" + counter });
            });
        $(".check-me").text(checkMeKey);
        $(".check-me-title").attr({ "title": checkMeKey });
        $(this).parents(".container").find("div.option-div:last").find("input#option" + counter).focus();
        return false;
    }
}, ".add-options");

/**
 * @event Click for remove the Option
 */
$(document).on("click", ".remove-option", function(eve) {
    $(this).parents("div.question-container").find(".option-required-err").remove();
    /* Remove Error Message and show add option button */
    if ($(this).parents(".question-container").find(".max-option-err-box").length > 0) {
        $(this).parents(".question-container").find(".max-option-err-box").remove();
        $(this).parents(".question-container").find(".add-options").show();
    }

    if ($(this).parents("div.question-container").find("div.option-div").length > 2) {
        let selector = $(this).closest("div.container");
        $(this).parents("div.option-div").remove();

        $(selector)
            .find("div.option-div div.input-group input[type='text']")
            .each(function(index, elem) {
                let counter = index + 1;
                $(elem).attr({
                    placeholder: optionKey,
                });
                $(elem).attr({ id: "option" + counter });
                $(elem)
                    .parents(".option-div")
                    .find("input[type='file']")
                    .attr({ id: "option-image-" + counter });
                $(elem)
                    .parents(".option-div")
                    .find("input.form-check-input")
                    .attr({ id: "check" + counter });
            });

    } else {
        $(this).parents("div.question-container")
            .find("div.form-group-opt:first")
            .after(`
                <div class="clearfix"></div>
                <label class="label-alert d-block option-required-err text-left pull-left mt--8 mb--16">
                    <font>${atLeastTwoOptionsRequiredKey}</font>
                </label>
                <div class="clearfix"></div>
            `);

        $([document.documentElement, document.body]).animate({
            scrollTop: $(".label-alert.d-block:first").offset().top
        }, Constants.setIntervalTimeThousand());
    }
});

/**
 * @event Click to Submit Quiz
 */
$(document).on("click", "#submit", function(e) {
    e.preventDefault();
    $("#submit").prop("disabled", true);
    $(".loader-overlay").show();
    $(".loader-overlay").show("fast", function() {
        submitForm();
    });
});

/**
 * @event Change on quiz title
 */
$(document).on("change", "#quiz-title", function() {
    if ($("#quiz-title").val().length > 0) {
        $("#next").prop("disabled", false);
        $(this).parents(".form-group").find(".label-alert.d-block:first").remove();
        $(this).removeClass("danger");
    }
});

/**
 * @event Click on clear button on training section
 */
$(document).on("click", ".quiz-clear", function() {
    $(".error-msg").remove();
    $("div.section-1 .photo-box").show();
    $("div.section-1 .quiz-updated-img").hide();
    $("div.section-2 .card-box:first #cover-image").val("");
    $("div.section-2 .card-box:first .quiz-updated-img").hide();
    $(".quiz-updated-img").removeClass("smallfit");
    $(".quiz-updated-img").removeClass("heightfit");
    $(".quiz-updated-img").removeClass("widthfit");
    $(this).hide();
    $(".quiz-updated-img img#quiz-img-preview").attr("src", "");
    $(".quiz-updated-img img#quiz-title-image").attr("src", "");
    $("#quiz-attachment-set").remove();
    $("textarea#quiz-attachment-set").remove();
    $(".loader-cover").removeClass("d-none");
    attachmentSet = [];
});

/**
 * @event Click for next section at Quiz title and description page
 */
$(document).on("click", "#next", function() {
    let isError = false;
    $(".section-2").find(".question-required-err").remove();
    $(".section-2").find(".confirm-box").remove();

    $("form").find("input[type='text']").each(function() {
        let element = $(this);
        if (element.val() == "") {
            if (element.attr("id") == "quiz-title") {
                isError = true;
                $("#quiz-title").addClass("danger");
                $("#quiz-title").before(`<label class="label-alert d-block mb--4"><font class="required-key">${requiredKey}</font></label>`);
                $("#next").prop("disabled", true);
            }
        }
    });

    if (isError == false) {
        $("#next").prop("disabled", false);

        $(".section-1").hide();
        $(".section-1-footer").hide();

        if ($(".section-2.d-none").length > 0) {
            $(".section-2").removeClass("d-none");
        } else {
            $(".section-2").show();

        }
        if ($(".section-2-footer.d-none").length > 0) {
            $(".section-2-footer").removeClass("d-none");
        } else {
            $(".section-2-footer").show();
        }

        /* Populate Data on the question area */
        $("#quiz-title-content").html($("#quiz-title").val());
        $("#quiz-description-content").html($("#quiz-description").val());

    }
});

/**
 * @event Keydown  to back button on section 2
 */
KeyboardAccess.keydownClick(document, "#back-questionsContainer");

/**
 * @event Click to back button on section 2
 */
$(document).on({
    click: function(e) {
        $(".section-2").hide();
        $(".section-2-footer").hide();

        $(".section-1").show();
        $(".section-1-footer").show();
        $(".error-msg").remove();
    }
}, "#back-questionsContainer");

/**
 * @event Change event for setting inputs
 */
$(document).on("change", "input[name='expiry_time'], input[name='expiry_date'], .visible-to, #show-correct-answer", function() {
    $(".invalid-date-err").remove();
    let end = new Date($("input[name='expiry_date']").val() + " " + $("input[name='expiry_time']").val());
    $(".text-danger").parent("div.col-12").remove();
    $("#back").removeClass("disabled");

    let start = new Date();
    let days = Utils.calcDateDiff(start, end);

    if (days == undefined || days == NaN) {
        $(".setting-section .row:first").append(`<div class="col-12 mt--32 invalid-date-err"><p class="text-danger">${invalidDateTimeKey}</p></div>`);
        $("#back").addClass("disabled");
    } else {
        let resultVisible = $(".visible-to:checked").val() == "Everyone" ? resultEveryoneKey : resultMeKey;
        let correctAnswer = $("#show-correct-answer:eq(0)").is(":checked") == true ? correctAnswerKey : "";

        Localizer.getString("dueIn", days, correctAnswer).then(function(result) {
            settingText = result;
        });
    }
});

/**
 * @event Keydown event for correct answer inputs
 */
KeyboardAccess.keydownClick(document, ".check-me-title");

/**
 * @event Click event for correct answer inputs
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        if ($(this).parents("div.col-12").find("input[type='checkbox']").prop("checked") == false) {
            $(this).parents("div.col-12").find("input[type='checkbox']").prop("checked", true);
            $(this).addClass("checked-112");
        } else {
            $(this).parents("div.col-12").find("input[type='checkbox']").prop("checked", false);
            $(this).removeClass("checked-112");
        }
        return false;
    }
}, ".check-me-title");

/**
 * @event Keydown event for remove options
 */
KeyboardAccess.removeOptionKeydown(document, ".remove-option-href");

/**
 * @event Click when click on class then open hidden file
 */
$(document).on("click", ".upvj", function(event) {
    event.preventDefault();
    if ($(this).parents("div.section-1").length > 0) {
        $(".section-2").find("div.card-box:first").find("input[type='file']").click();
    } else {
        $(".section-2").find("div.card-box:last").find("input[type='file']").click();
    }
});

/**
 * @event Focusin to show trash on focusin at input
 */
$(document).on("focusin", ".option-div, .input-group-append, .input-group, .input-group input[type='text'], .input-tpt, .input-tpt .remove-option", function() {
    $(this).parents("div.row").find(".remove-option").show();
});

/**
 * @event Focusout to hide trash on focusout at input
 */
$(document).on("focusout", ".option-div, .input-tpt, .input-tpt .remove-option, .check-me-title, .input-group input[type='text']", function() {
    $(this).parents("div.row").find(".remove-option").hide();
});

/**
 * @event Hover to show trash on focusin at input
 */
$(document).on("hover", ".remove-option", function() {
    $(this).show();
});

/**
 * @event Change when quiz cover image changes
 */
$(document).on("change", "#cover-image", function() {
    $(".error-msg").remove();
    $(".invalid-image-format").remove();
    let urlResponse = Utils.readURL(this, "#quiz-img-preview, #quiz-title-image");
    if (urlResponse == true) {
        UxUtils.removeImageLoaderCreationView("#quiz-img-preview");

        /* Perform image upload for quiz template */
        let fileData = this;
        if ($(fileData).val() != "") {
            let coverImage = fileData.files[0];
            let attachment = ActionHelper.attachmentUpload(coverImage, coverImage["type"]);
            let attachmentRequest = {};
            if (!$("#submit").hasClass("disabled")) {
                $("#submit").addClass("disabled");
                $("#submit").prepend(UxUtils.getButtonSpinner());
            }
            attachmentRequest = ActionHelper.requestAttachmentUploadDraft(attachment);
            ActionHelper.executeApi(attachmentRequest)
                .then(function(response) {
                    let attachmentData = { "name": "quiz-banner", type: "Image", id: response.attachmentId };
                    attachmentSet.push(attachmentData);
                    if ($("#quiz-attachment-set").length > 0) {
                        $("#quiz-attachment-set").val(JSON.stringify(attachmentData));
                    } else {
                        if ($(fileData).val() != "") {
                            $(fileData).after(UxUtils.createQuizTextarea(attachmentData));
                        }
                    }
                    $("#submit").removeClass("disabled");
                    $("#submit").find(`.spinner-border.spinner-border-sm`).remove();
                })
                .catch(function(error) {
                    console.log("GetContext - Error2: " + JSON.stringify(error));
                });
        }

        $(".photo-box").hide();
        $(".quiz-updated-img").show();
        $(".quiz-updated-img").show();
        $("#quiz-title-image").show();
        $(".quiz-updated-img").show();
        $(".quiz-clear").show();
    } else {
        $(".photo-box").parents("div.form-group").find("label.clear-key").after(UxUtils.getInvalidFileError(invalidFileFormatKey));
    }

});

/**
 * @event Keydown when question cover image changes
 */
KeyboardAccess.keydownClick(document, ".question-image, .option-image");

/**
 * @event Click when question cover image changes
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        $(this).parents(".input-group").find("input[type='file']").click();
        return false;
    }
}, ".question-image, .option-image");

/**
 * @event Change when question cover image changes
 */
$(document).on("change", "input[name='question_image']", function() {
    $(".invalid-file-question").remove();
    let urlReturn = Utils.readURL(this, $(this).parents("div.form-group-question").find(".question-preview-image"));
    if (urlReturn == true) {
        $(this).parents("div.form-group-question").find(".question-preview-image").show();
        $(this).parents("div.form-group-question").find(".question-preview").show();

        /* Perform image upload for question image */
        let fileData = this;
        if ($(fileData).val() != "") {
            if (!$("#submit").hasClass("disabled")) {
                $("#submit").addClass("disabled");
                $("#submit").prepend(UxUtils.getButtonSpinner());
            }
            let coverImage = fileData.files[0];
            let attachment = ActionHelper.attachmentUpload(coverImage, coverImage["type"]);
            let attachmentRequest = ActionHelper.requestAttachmentUploadDraft(attachment);
            let imgIndex = $(this).attr("id");
            ActionHelper.executeApi(attachmentRequest)
                .then(function(response) {
                    let attachmentData = { "name": "question-banner-" + imgIndex, type: "Image", id: response.attachmentId };
                    let selector = $(this).parents(".question-container").attr("id");
                    if ($("#" + selector).find("#question-attachment-set").length > 0) {
                        $("#" + selector).find("#question-attachment-set").val(JSON.stringify(attachmentData));
                    } else {
                        if ($(fileData).val() != "") {
                            $(fileData).after(UxUtils.createQuestionTextarea(attachmentData));
                        }
                    }
                    $("#submit").removeClass("disabled");
                    $("#submit").find(`.spinner-border.spinner-border-sm`).remove();
                })
                .catch(function(error) {
                    console.log("GetContext - Error3: " + JSON.stringify(error));
                });
        }
    } else {
        $(".question-preview-image").attr("src", "");
        $(".question-preview").hide();
        $(this).parents(".form-group-question").find(".question-preview").before(UxUtils.getQuestionInvalidFileError(invalidFileFormatKey));
        $(this).parents("div.input-group-append").find("#question-attachment-set").remove();
    }
});

/**
 * @event Change when option cover image changes
 */
$(document).on("change", "input[name='option_image']", function() {
    $(".invalid-file-option").remove();
    let urlReturn = Utils.readURL(this, $(this).parents("div.row").find(".option-preview-image"));
    $(this).parents("div.row").find(".option-preview-image").show();
    $(this).parents("div.row").find("div.option-preview").show();
    if (urlReturn == true) {
        let fileData = this;
        if ($(fileData).val() != "") {
            if (!$("#submit").hasClass("disabled")) {
                $("#submit").addClass("disabled");
                $("#submit").prepend(UxUtils.getButtonSpinner());
            }
            let coverImage = fileData.files[0];
            let attachment = ActionHelper.attachmentUpload(coverImage, coverImage["type"]);
            let attachmentRequest = ActionHelper.requestAttachmentUploadDraft(attachment);
            let imgIndex = $(this).attr("id");
            ActionHelper.executeApi(attachmentRequest)
                .then(function(response) {
                    let attachmentData = { "name": "option-banner-" + imgIndex, type: "Image", id: response.attachmentId };
                    let selector = $(this).parents(".row");
                    if ($(selector).find("textarea#option-attachment-set").length > 0) {
                        $(selector).find("textarea#option-attachment-set").val(JSON.stringify(attachmentData));
                    } else {
                        if ($(fileData).val() != "") {
                            $(fileData).after(UxUtils.createOptionTextarea(attachmentData));
                        }
                    }
                    $("#submit").removeClass("disabled");
                    $("#submit").find(`.spinner-border.spinner-border-sm`).remove();
                })
                .catch(function(error) {
                    console.log("GetContext - Error4: " + JSON.stringify(error));
                });
        }
    } else {
        $(this).parents("div.option-div").find(".option-preview-image").attr("src", "");
        $(this).parents("div.option-div").find(".option-preview").hide();
        $(this).parents("div.option-div").prepend(UxUtils.getOptionInvalidFileError(invalidFileFormatKey));
        $(this).parents("div.option-div").find("#question-attachment-set").remove();
    }
});

/**
 * @event Keydown for open image upload
 */
KeyboardAccess.photoBoxKeydown(document, ".photo-box-href");

/**
 * @event Keydown for clear banner image from quiz
 */
KeyboardAccess.clearKeydown(document, ".clear-key-href");

/**
 * @event Click for clear banner image from quiz
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        $(".quiz-clear").get(0).click();
        return false;
    }
}, ".clear-key-href");

/**
 * @event Keydown to show setting section
 */
KeyboardAccess.keydownClick(document, ".show-setting");

/**
 * @event Click to show setting section
 */
$(document).on({
    click: function(e) {
        e.preventDefault();
        $(".section-1").hide();
        $(".section-1-footer").hide();
        $("form #setting").show();
        return false;
    }
}, ".show-setting");

/**
 * @event Keydown for back to landing page
 */
KeyboardAccess.keydownClick(document, "#back");

/**
 * @event Click for back to landing page
 */
$(document).on({
    click: function(e) {
        $(".section-1").show();
        $(".section-1-footer").show();
        e.preventDefault();

        $("form #setting").hide();
        $("#due").text(settingText);
        return false;
    }
}, "#back");

/**
 * @event Keydown for back button on question area
 */
KeyboardAccess.keydownClick(document, "#back-section2");

/**
 * @event Event to back button on question area
 */
$(document).on("click", "#back-section2", function() {
    $(".section-2").hide();
    $(".section-2-footer").hide();
    $(".section-1").show();
    $(".section-1-footer").show();
    $(".error-msg").remove();
});

/**
 * @event Keydown to clear image
 */
KeyboardAccess.clearQuizKeydown(document, ".clear-key-href");

/* ****************************** Method ************************************* */
/**
 * @description Method for quiz data and submit the datas
 */
function submitForm() {
    /* Validate */
    let errorText = "";
    $("input[type='text']").removeClass("danger");
    $("label.label-alert").remove();
    $("div.card-box-alert").removeClass("card-box-alert").addClass("card-box");
    $(".section-2").find(".question-required-err").remove();
    $(".section-2").find(".confirm-box").remove();

    $(".question-container:visible").each(function(qind, quest) {
        let isChecked = false;
        $(quest).find("#options").find("input[type='checkbox']").each(function(optind, opt) {
            if ($(opt).prop("checked") == true) {
                isChecked = true;
            }
        });

        if (isChecked != true) {
            let questionId = $(quest).attr("id");
            $("#" + questionId)
                .find("div.d-flex-ques")
                .after(UxUtils.getSelectCorrectOptionError(selectCorrectChoiceKey));

            $("#submit").prop("disabled", false);

            $("#" + questionId)
                .find("div.card-box")
                .removeClass("card-box")
                .addClass("card-box-alert");
            errorText += "Option check required";

            $([document.documentElement, document.body]).animate({
                scrollTop: $(".option-required-err:last").offset().top - Constants.getWidthOffsets()
            }, Constants.setIntervalTimeThousand());
        }
    });

    $("form")
        .find("input[type='text']")
        .each(function() {
            let element = $(this);
            if (element.val() == "") {
                if (element.attr("id") == "quiz-title") {
                    errorText += "<p>Quiz title is required.</p>";
                    $("#quiz-title").addClass("danger");
                    $("#quiz-title").before(
                        `<label class="label-alert d-block mb--4"><font class="required-key">${requiredKey}</font></label>`
                    );

                    if ($(this).find("div.card-box").length > 0) {
                        $(this).parents("div.card-box").removeClass("card-box").addClass("card-box-alert");
                    }
                } else if (element.attr("id").startsWith("question-title")) {
                    if ($(element).parents("div.form-group-question").find("img.question-preview-image").attr("src") != "") {
                        // Do nothing
                    } else {
                        if ($(this).find("div.card-box").length > 0) {
                            $(this).parents("div.card-box").removeClass("card-box").addClass("card-box-alert");
                        }
                        $(element).addClass("danger");
                        Localizer.getString("questionLeftBlank").then(function(result) {
                            $(".question-blank-key").text(result);
                            $(element)
                                .parents("div.form-group-question").find(".question-number").parent("div")
                                .after(UxUtils.getQuestionRequiredError(result));
                        });

                        errorText += "<p>Question cannot not left blank.</p>";
                        $(element).addClass("danger");
                    }
                } else if (element.attr("id").startsWith("option")) {
                    if ($(element).parents("div.radio-outer").find("img.option-preview-image").attr("src") != "") {
                        // Do nothing
                    } else {
                        if ($(this).find("div.card-box").length > 0) {
                            $(this).parents("div.card-box").removeClass("card-box").addClass("card-box-alert");
                        }
                        $(this).addClass("danger");
                        $(this)
                            .parents("div.col-12").parents("div.option-div")
                            .prepend(UxUtils.getRequiredError(requiredKey));

                        errorText +=
                            "<p>Blank option not allowed for " +
                            element.attr("placeholder") +
                            ".</p>";
                    }
                }
            }
        });

    if ($.trim(errorText).length <= 0) {
        ActionHelper
            .executeApi(request)
            .then(function(response) {
                createAction(response.context.actionPackageId);
            })
            .catch(function(error) {
                console.error("GetContext - Error1: " + JSON.stringify(error));
            });
    } else {
        $(".loader-overlay").hide();
        $(".required-key").text(requiredKey);
        $("#submit").prop("disabled", false);
        return;
    }
}

/**
 * @description Method to get questions and return question object
 */
function getQuestionSet() {
    let questionCount = $("form").find("div.container.question-container").length;
    questions = new Array();
    let error = false;

    for (let i = 1; i <= questionCount; i++) {
        let optionType = ActionHelper.getColumnType("singleselect");
        let option = [];
        let isSelected = 0;
        let questionAttachmentSet = $("#question" + i).find("textarea#question-attachment-set").length > 0 ? JSON.parse($("#question" + i).find("textarea#question-attachment-set").val()) : "";

        /* Looping for options */
        $("#question" + i)
            .find("div.option-div")
            .each(function(index, elem) {
                let count = index + 1;
                let optId = "question" + i + "option" + count;
                let optTitle = $("#question" + i).find("#option" + count).val();
                let optionAttachmentSet = $("#question" + i).find("#option" + count).parents("div.option-div").find("textarea#option-attachment-set").length > 0 ? JSON.parse($("#question" + i).find("#option" + count).parents("div.option-div").find("textarea#option-attachment-set").val()) : "";

                if ($("#question" + i).find("#check" + count).is(":checked")) {
                    // if it is checked
                    isSelected++;
                }

                if ($("#question" + i).find("input[type=checkbox]:checked").length > 1) {
                    optionType = ActionHelper.getColumnType("multiselect");
                } else {
                    optionType = ActionHelper.getColumnType("singleselect");
                }
                if (optionAttachmentSet != "") {
                    option.push({
                        name: optId,
                        displayName: optTitle,
                        attachments: [optionAttachmentSet]
                    });
                } else {
                    option.push({
                        name: optId,
                        displayName: optTitle,
                        attachments: []
                    });
                }
            });

        let val = {};
        if (questionAttachmentSet != "") {
            val = {
                name: i.toString(),
                displayName: $("#question" + i).find("#question-title").val(),
                valueType: optionType,
                allowNullValue: false,
                options: option,
                attachments: [questionAttachmentSet]
            };
        } else {
            val = {
                name: i.toString(),
                displayName: $("#question" + i).find("#question-title").val(),
                valueType: optionType,
                allowNullValue: false,
                options: option,
                attachments: []
            };
        }

        if (isSelected == 0) {
            $("#question" + i)
                .find("div.d-flex-ques")
                .after(UxUtils.getSelectCorrectOptionError(selectCorrectChoiceKey));

            $("#submit").prop("disabled", false);

            $("#question" + i)
                .find("div.card-box")
                .removeClass("card-box")
                .addClass("card-box-alert");
            error = true;
        }
        questions.push(val);
    }

    if (error == false) {

        return questions;
    } else {
        return false;
    }
}

/**
 * @description Method to get correct answers and retrun property object
 */
function getCorrectAnswer() {
    let questionCount = $("form").find("div.container.question-container").length;
    let correctOption = [];

    for (let i = 1; i <= questionCount; i++) {
        let correct = [];

        /* Looping for options */
        $("#question" + i)
            .find("div.option-div")
            .each(function(index, elem) {
                let count = index + 1;

                if ($("#question" + i).find("#check" + count).is(":checked")) {
                    let optId = "question" + i + "option" + count;

                    // if it is checked
                    correct.push(optId);
                }
            });
        correctOption[i - 1] = correct;
    }
    let property = {
        name: "Question Answers",
        type: "LargeText",
        value: JSON.stringify(correctOption),
    };

    return property;
}

/**
 * @description Method to create Action Request and submit data to server
 * @param action package id
 */
function createAction(actionPackageId) {
    let quizTitle = $("#quiz-title").val();
    let quizDescription = $("#quiz-description").val();
    let quizExpireDate = $("input[name='expiry_date']").val();
    let quizExpireTime = $("#setting").find("div.form_time").find("input").val();
    let quizAttachementSet = $("#quiz-attachment-set").length > 0 ? $("#quiz-attachment-set").val() : "";
    let quizAttachementId = (quizAttachementSet != "") ? JSON.parse(quizAttachementSet).id : "";
    let resultVisible = $("input[name='visible_to']:checked").val();
    let showCorrectAnswer = $("#show-correct-answer").is(":checked") ?
        "Yes" :
        "No";
    let questionsSet = getQuestionSet();
    let getcorrectanswers = getCorrectAnswer();

    if (questionsSet == false) {
        return false;
    }

    let properties = [];
    properties.push({
        name: "Quiz Description",
        canAddMore: false,
        type: "LargeText",
        value: quizDescription,
    }, {
        name: "Quiz Expire Date Time",
        canAddMore: false,
        type: "DateTime",
        value: new Date(quizExpireDate + " " + quizExpireTime),
    }, {
        name: "Result Visible",
        canAddMore: false,
        type: "Text",
        value: resultVisible,
    }, {
        name: "Show Correct Answer",
        canAddMore: false,
        type: "Text",
        value: showCorrectAnswer,
    }, {
        name: "Attachment Id",
        canAddMore: false,
        type: "LargeText",
        value: quizAttachementId,
    });
    properties.push(getcorrectanswers);

    let action = {
        id: Utils.generateGUID(),
        actionPackageId: actionPackageId,
        version: 1,
        displayName: quizTitle,
        description: quizDescription,
        expiryTime: new Date(quizExpireDate + " " + quizExpireTime).getTime(),
        customProperties: properties,
        dataTables: [{
            name: "QuizDataSet",
            itemsVisibility: ActionHelper.visibility(),
            rowsVisibility: ActionHelper.visibility(),
            itemsEditable: false,
            canUserAddMultipleItems: false,
            dataColumns: questionsSet,
            attachments: attachmentSet,
        }],
    };

    let request = ActionHelper.createAction(action);
    ActionHelper
        .executeApi(request)
        .then(function(response) {
            console.info("CreateAction - Response: " + JSON.stringify(response));
        })
        .catch(function(error) {
            console.error("CreateAction - Error: " + JSON.stringify(error));
        });
}

/**
 * Initiate Method
 */
$(document).ready(function() {
    request = ActionHelper.getContextRequest();
    getStringKeys();
    loadCreationPage(request);
});

/**
 * @description Async method for fetching localization strings
 */
async function getStringKeys() {
    Localizer.getString("quizTitle").then(function(result) {
        $("#quiz-title").attr({ "placeholder": result });
    });

    Localizer.getString("quizDescription").then(function(result) {
        $("#quiz-description").attr({ "placeholder": result });
    });

    Localizer.getString("enterTheQuestion").then(function(result) {
        $("#question-title").attr({ "placeholder": result });
        questionTitleKey = result;
    });

    Localizer.getString("option", "").then(function(result) {
        optionKey = result;
        $(".opt-cls").attr("placeholder", optionKey);
    });
    Localizer.getString("dueIn", " 1 week", "").then(function(result) {
        settingText = result;
        $("#due").text(settingText);
    });

    Localizer.getString("addMoreOptions").then(function(result) {
        addMoreOptionsKey = result;
        $(".add-options").html(`
            ${Constants.getPlusIcon()} ${addMoreOptionsKey}`);
    });

    Localizer.getString("choices").then(function(result) {
        choicesKey = result;
        $(".choice-label").text(choicesKey);
    });

    Localizer.getString("checkMe").then(function(result) {
        checkMeKey = result;
        $(".check-me").text(checkMeKey);
        $(".check-me-title").attr({ "title": checkMeKey });
    });

    Localizer.getString("next").then(function(result) {
        nextKey = result;
        $(".next-key").text(nextKey);
    });

    Localizer.getString("back").then(function(result) {
        backKey = result;
        $(".back-key").text(backKey);
    });

    Localizer.getString("required").then(function(result) {
        requiredKey = result;
        $(".required-key").text(requiredKey);
    });

    Localizer.getString("dueBy").then(function(result) {
        dueByKey = result;
        $(".due-by-key").text(dueByKey);
    });

    Localizer.getString("resultVisibleTo").then(function(result) {
        resultVisibleToKey = result;
        $(".result-visible-key").text(resultVisibleToKey);
    });

    Localizer.getString("resultEveryone").then(function(result) {
        resultEveryoneKey = result;
    });

    Localizer.getString("resultMe").then(function(result) {
        resultMeKey = result;
    });

    Localizer.getString("correctAnswer", ", ").then(function(result) {
        correctAnswerKey = result;
    });

    Localizer.getString("everyone", ", ").then(function(result) {
        everyoneKey = result;
        $(".everyone-key").text(everyoneKey);
    });

    Localizer.getString("onlyMe", ", ").then(function(result) {
        onlyMeKey = result;
        $(".onlyme-key").text(onlyMeKey);
    });

    Localizer.getString("showCorrectAnswer").then(function(result) {
        showCorrectAnswerKey = result;
        $(".show-correct-key").text(showCorrectAnswerKey);
    });

    Localizer.getString("answerCannotChange").then(function(result) {
        answerCannotChangeKey = result;
        $(".answer-cannot-change-key").text(answerCannotChangeKey);
    });

    Localizer.getString("invalidDateTime").then(function(result) {
        invalidDateTimeKey = result;
    });

    Localizer.getString("sureDeleteThis").then(function(result) {
        sureDeleteThisKey = result;
    });

    Localizer.getString("ok").then(function(result) {
        okKey = result;
    });

    Localizer.getString("cancel").then(function(result) {
        cancelKey = result;
    });

    Localizer.getString("forQuizAtleastOneQuestion").then(function(result) {
        forQuizAtleastOneQuestionKey = result;
    });

    Localizer.getString("maxTenOption").then(function(result) {
        maxTenOptionKey = result;
    });

    Localizer.getString("atLeastTwoOptionsRequired").then(function(result) {
        atLeastTwoOptionsRequiredKey = result;
    });

    Localizer.getString("questionLeftBlank").then(function(result) {
        questionLeftBlankKey = result;
        $(".question-blank-key").text(result);
    });

    Localizer.getString("selectCorrectChoice").then(function(result) {
        selectCorrectChoiceKey = result;
    });

    Localizer.getString("addQuestion").then(function(result) {
        addQuestionKey = result;
        $(".add-question-key").text(addQuestionKey);
    });

    Localizer.getString("uploadCoverImage").then(function(result) {
        uploadCoverImageKey = result;
        $(".upload-cover-image-key").text(uploadCoverImageKey);
    });

    Localizer.getString("coverImage").then(function(result) {
        coverImageKey = result;
        $(".cover-image-key").text(coverImageKey);
    });

    Localizer.getString("clear").then(function(result) {
        clearKey = result;
        $(".clear-key").text(clearKey);
    });

    Localizer.getString("invalidFileFormat").then(function(result) {
        invalidFileFormatKey = result;
        $(".invalid-file-key").text(invalidFileFormatKey);
    });
}

/**
 * @description Method to select theme based on the teams theme
 * @param request context request
 */
async function loadCreationPage(request) {
    let response = await ActionHelper.executeApi(request);
    let context = response.context;
    lastSession = context.lastSessionData;
    let theme = context.theme;
    $(".body-outer").before(loader);
    $("link#theme").attr("href", "css/style-" + theme + ".css");

    $("form.sec1").append(formSection);
    $("form.sec1").append(questionsContainer);
    $("form.sec1").after(settingSection);
    $("form.sec1").after(optionSection);
    $("form.sec1").after(questionArea);
    getStringKeys();
    quesContainer = $("#question-section div.container").clone();
    opt = $("div#option-section .option-div").clone();
    let weekDateFormat;
    let currentTime;
    let isImage = false;
    let imageCounter = 0;
    let imageSuccessCounter = 0;

    /* If Edit back the quiz */
    if (lastSession != null) {
        lastSession.action.dataTables.forEach((dataTable, ind) => {
            if (dataTable.attachments.length > 0) {
                imageCounter++;
                isImage = true;
                let req = ActionHelper.getAttachmentInfoDraft(dataTable.attachments[0].id);
                ActionHelper.executeApi(req).then(function(response) {
                        lastSession.action.dataTables[ind].attachments[0].url = response.attachmentInfo.downloadUrl;
                        if (lastSession.action.dataTables[0].attachments[0].url != null) {
                            UxUtils.loadQuizTemplateImage(response.attachmentInfo.downloadUrl, lastSession.action.dataTables[0].attachments);
                            let tid = setInterval(() => {
                                if ($("#quiz-img-preview, #quiz-title-image").attr("src").length > 0) {
                                    Utils.getClassFromDimension(response.attachmentInfo.downloadUrl, "#quiz-img-preview, #quiz-title-image");
                                    UxUtils.removeImageLoaderCreationView("#quiz-img-preview");
                                    UxUtils.removeImageLoaderCreationView("#quiz-title-image");
                                    clearInterval(tid);
                                }
                            }, Constants.setIntervalTimeHundred());
                            imageSuccessCounter++;
                        }
                        ActionHelper.hideLoader();
                    })
                    .catch(function(error) {
                        console.error("AttachmentAction - Errorquiz: " + JSON.stringify(error));
                    });
            }
            dataTable.dataColumns.forEach((questions, qindex) => {
                if (questions.attachments.length > 0) {
                    imageCounter++;
                    isImage = true;
                    let req = ActionHelper.getAttachmentInfoDraft(questions.attachments[0].id);
                    ActionHelper.executeApi(req).then(function(response) {
                            lastSession.action.dataTables[ind].dataColumns[qindex].attachments[0].url = response.attachmentInfo.downloadUrl;
                            imageSuccessCounter++;
                        })
                        .catch(function(error) {
                            console.error("AttachmentAction - Errorquestion: " + JSON.stringify(error));
                        });
                }

                questions.options.forEach((option, optindex) => {
                    if (option.attachments.length > 0) {
                        imageCounter++;
                        isImage = true;
                        let req = ActionHelper.getAttachmentInfoDraft(option.attachments[0].id);
                        ActionHelper.executeApi(req).then(function(response) {
                                lastSession.action.dataTables[ind].dataColumns[qindex].options[optindex].attachments[0].url = response.attachmentInfo.downloadUrl;
                                imageSuccessCounter++;
                            })
                            .catch(function(error) {
                                console.error("AttachmentAction - Erroroptions: " + JSON.stringify(error));
                            });
                    }
                });
            });
        });
        if (isImage == false) {
            ActionHelper.hideLoader();
        }
        let expiryDateTime = lastSession.action.customProperties[1].value;
        let expiryTime = lastSession.action.expiryTime;
        let ddtt = (expiryDateTime).split("T");
        let dt = ddtt[0].split("-");
        weekDateFormat = new Date(dt[1]).toLocaleString("default", { month: "short" }) + " " + dt[2] + ", " + dt[0];
        let timeData = new Date(expiryTime);
        let hourData = timeData.getHours();
        let minuteData = timeData.getMinutes();
        currentTime = hourData + ":" + minuteData;
        if (lastSession.action.customProperties[2].value == "Everyone") {
            $("input[name='visible_to'][value='Everyone']").prop("checked", true);
        } else {
            $("input[name='visible_to'][value='Only me']").prop("checked", true);
        }
        if (lastSession.action.customProperties[3].value == "Yes") {
            $("#show-correct-answer").prop("checked", true);
        } else {
            $("#show-correct-answer").prop("checked", false);
        }

        let quizTitle = lastSession.action.displayName;
        let quizDescription = lastSession.action.customProperties[0].value;

        /* Quiz Section */
        $("#quiz-title").val(quizTitle);
        $("#quiz-description").val(quizDescription);

        /* Quiz Section Attachment Check */
        let quizAttachmentId = lastSession.action.dataTables[0].attachments[0].id;
        if (quizAttachmentId != null) {
            let attachmentData = lastSession.action.dataTables[0].attachments[0];
            attachmentSet.push(attachmentData);
        }

        /* Due Setting String */
        let end = new Date(weekDateFormat + " " + currentTime);
        let start = new Date();
        let days = Utils.calcDateDiff(start, end);
        let correctAnswerSetting = lastSession.action.customProperties[3].value;
        let correctAnswer = correctAnswerSetting == "Yes" ? correctAnswerKey : "";
        Localizer.getString("dueIn", days, correctAnswer).then(function(result) {
            settingText = result;
            $("#due").text(settingText);
        });
    } else {
        let weekDate = new Date(new Date().setDate(new Date().getDate() + 7))
            .toISOString()
            .split("T")[0];
        let weekMonth = new Date(weekDate).toLocaleString("default", { month: "short" });
        let weekD = new Date(weekDate).getDate();
        let weekYear = new Date(weekDate).getFullYear();
        weekDateFormat = weekMonth + " " + weekD + ", " + weekYear;
        currentTime = (("0" + new Date().getHours()).substr(-2)) + ":" + (("0" + new Date().getMinutes()).substr(-2));
    }
    let today = new Date()
        .toISOString()
        .split("T")[0];
    $("form").append($("#setting").clone());
    $("#add-questions").click();
    setTimeout(() => {
        $("form.sec1").show();
    }, Constants.setIntervalTimeThousand());
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
    if (lastSession != null) {
        $("#next").addClass("disabled");
        let tid = setInterval(() => {
            if (imageSuccessCounter == imageCounter) {
                $("#next").removeClass("disabled");
                let option = $("div#option-section .option-div").clone();
                lastSession.action.dataTables[0].dataColumns.forEach((e, ind) => {
                    let correctAnsArr = JSON.parse(lastSession.action.customProperties[5].value);
                    if (ind == 0) {
                        let questionTitleData = e.displayName;
                        let questionAttachmentData = e.attachments.length > 0 ? e.attachments[0].id : "";
                        $("#question1").find("#question-title").val(questionTitleData);
                        if (questionAttachmentData != "") {
                            let attachmentData = e.attachments[0];
                            UxUtils.loadQuestionImage("#question1", "#question-image-1", attachmentData.url, attachmentData);
                            Utils.getClassFromDimension(attachmentData.url, $("#question1").find(".question-preview-image"));
                        }

                        e.options.forEach((opt, i) => {
                            let counter = i + 1;
                            let optionName = opt.displayName;
                            let optionAttachment = opt.attachments.length > 0 ? opt.attachments[0].id : "";
                            if (i <= 1) {
                                $("#question1").find("#option" + counter).val(optionName);
                            } else {
                                $("#question1").find("div.option-div:last").after(option.clone());
                                $("#question1").find("div.option-div:last input[type='text']").attr({
                                    placeholder: optionKey,
                                });
                                $("#question1").find("div.option-div:last input[type='text']").attr({ id: "option" + counter }).val(optionName);
                                $("#question1").find("div.option-div:last input[type='text']")
                                    .parents(".option-div")
                                    .find("input[type='file']")
                                    .attr({ id: "option-image-" + counter });
                                $("#question1").find("div.option-div:last input[type='text']")
                                    .parents(".option-div")
                                    .find("input.form-check-input")
                                    .attr({ id: "check" + counter });
                            }

                            $.each(correctAnsArr, function(cindex, cAns) {
                                if ($.inArray("question1option" + counter, cAns) != -1) {
                                    $("#question1").find("#check" + counter).prop("checked", true);
                                    $("#question1").find("#option" + counter).parents("div.input-group.input-group-tpt.mb--8").find(".check-me-title").addClass("checked-112");
                                }
                            });
                            if (optionAttachment != "") {
                                let attachmentData = opt.attachments[0];
                                UxUtils.loadOptionImage("#question1", counter, attachmentData.url, attachmentData);
                                Utils.getClassFromDimension(attachmentData.url, $("#question1").find("#option" + counter).parents("div.col-12").find(".option-preview-image"));
                            }
                        });
                    } else {
                        let qcounter = ind + 1;
                        $(".section-2").find("#add-questions").parents("div.container").before($("#question-section").html());

                        let ocounter = 0;
                        let questionTitleData = e.displayName;
                        let questionAttachmentData = e.attachments.length > 0 ? e.attachments[0].id : "";
                        $(".section-2").find("div.container.question-container:last").attr("id", "question" + qcounter);
                        Localizer.getString("question").then(function(result) {
                            $("#question" + qcounter).find("span.question-number").text(result + " # " + qcounter);
                        });
                        $("#question" + qcounter).find("#question-title").val(questionTitleData);
                        if (questionAttachmentData != "") {
                            let attachmentData = e.attachments[0];
                            UxUtils.loadQuestionImage("#question" + qcounter, "#question-image-" + qcounter, attachmentData.url, attachmentData);
                            Utils.getClassFromDimension(attachmentData.url, $("#question" + qcounter).find(".question-preview-image"));
                        }

                        Localizer.getString("enterTheQuestion").then(function(result) {
                            $("div.container.question-container:visible:last").find("input[type='text']").attr({
                                placeholder: result,
                            });
                        });
                        e.options.forEach((opt, i) => {
                            ocounter = i + 1;
                            let optionName = opt.displayName;
                            let optionAttachment = opt.attachments.length ? opt.attachments[0].id : "";
                            if (i <= 1) {
                                $("#question" + qcounter).find("#option" + ocounter).val(optionName);
                            } else {
                                $("#question" + qcounter).find("div.option-div:last").after(option.clone());
                                $("#question" + qcounter).find("div.option-div:visible:last input[type='text']").attr({
                                    placeholder: optionKey,
                                });
                                $("#question" + qcounter).find("div.option-div:last input[type='text']").attr({ id: "option" + ocounter }).val(optionName);
                                $("#question" + qcounter).find("div.option-div:last input[type='file']").attr({ id: "option-image-" + ocounter });
                                $("#question" + qcounter).find("div.option-div:last input[type='text']").parents(".option-div").find("input.form-check-input").attr({ id: "check" + ocounter });
                            }
                            $.each(correctAnsArr, (cindex, cAns) => {
                                if ($.inArray("question" + qcounter + "option" + ocounter, cAns) != -1) {
                                    $("#question" + qcounter).find("#check" + ocounter).prop("checked", true);
                                    $("#question" + qcounter).find("#option" + ocounter).parents("div.input-group.input-group-tpt.mb--8").find(".check-me-title").addClass("checked-112");
                                }
                            });

                            if (optionAttachment != "") {
                                let attachmentData = opt.attachments[0];
                                UxUtils.loadOptionImage("#question" + qcounter, ocounter, attachmentData.url, attachmentData);
                                Utils.getClassFromDimension(attachmentData.url, $("#question" + qcounter).find("#option" + ocounter).parents("div.col-12").find(".option-preview-image"));
                            }
                        });
                    }
                });
                clearInterval(tid);
            }
        }, Constants.setIntervalTimeHundred());
    }
    await ActionHelper.hideLoader();
}

/********************************************   HTML Sections  ***********************************************************/
/**
 * @description Quiz Landing Page
 */
let formSection = UxUtils.getQuizLanding();

/**
 * @description question Container Question Landing page
 * Change naming questionsContainer
 */
let questionsContainer = UxUtils.getQuestionContainerLanding();

/**
 * @description Question Section
 */
let questionArea = UxUtils.getQuestionArea();

/**
 * @description Option Section
 */
let optionSection = UxUtils.getOptionSection();

/**
 * @description Setting Section
 */
let settingSection = UxUtils.getSettingBackButton();

/**
 * @description Variable contains Loader
 */
let loader = UxUtils.getLoader();
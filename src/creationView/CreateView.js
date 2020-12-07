import { Localizer, ActionHelper } from '../common/ActionSdkHelper';

let request;
let questionCount = 0;
let questions = new Array();
let settingText = '';
let questionSection = '';
let opt = '';
let lastSession = '';

let optionKey = '';
let addMoreOptionsKey = '';
let choicesKey = '';
let questionTitleKey = '';
let checkMeKey = '';
let nextKey = '';
let backKey = '';
let requiredKey = '';
let dueByKey = '';
let resultVisibleToKey = '';
let resultEveryoneKey = '';
let resultMeKey = '';
let correctAnswerKey = '';
let everyoneKey = '';
let onlyMeKey = '';
let showCorrectAnswerKey = '';
let answerCannotChangeKey = '';
let invalidDateTimeKey = '';
let sureDeleteThisKey = '';
let okKey = '';
let cancelKey = '';
let forQuizAtleastOneQuestionKey = '';
let maxTenOptionKey = '';
let atLeastTwoOptionsRequiredKey = '';
let questionLeftBlankKey = '';
let selectCorrectChoiceKey = '';
let addQuestionKey = '';
let uploadCoverImageKey = '';
let attachmentSet = [];
let coverImageKey = '';
let clearKey = '';

/* ******************************** Events ************************************** */
/** 
 * @event Click for add Question Section
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
        e.preventDefault();
        let questionCounter;
        $(this).parents("div.container").before(questionSection.clone());

        $('.section-2').find('.question-required-err').remove();
        $('.section-2').find('.confirm-box').remove();

        Localizer.getString('option', '').then(function (result) {
            $('.opt-cls').attr('placeholder', result)
        });

        $("div.container").each(function (ind, el) {
            $(el).find('div.option-div > div.input-group > input[type="text"]')
                .each(function (index, elem) {
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

        Localizer.getString('enterTheQuestion').then(function (result) {
            $("div.container").find('#question-title').attr({ 'placeholder': result });
        });

        $("div.question-container:visible").each(function (index, elem) {
            questionCounter = index + 1;
            $(elem)
                .find("span.question-number")
                .text('Question # ' + questionCounter);
            $(elem).find('input[name="question_image"]').attr({ id: "question-image-" + questionCounter });
            $(elem).attr({ id: "question" + questionCounter });
        });
        questionCount++;
        $('.check-me').text(checkMeKey);
        $('.check-me-title').attr({ "title": checkMeKey });
        $('.add-options').html(`
        <svg width="16" height="16" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"  class="cc gs gt tc gv">
            <path d="M7.49219 0.5C7.6276 0.5 7.74479 0.549479 7.84375 0.648438C7.94271 0.747396 7.99219 0.864583 7.99219 1V7H13.9922C14.1276 7 14.2448 7.04948 14.3438 7.14844C14.4427 7.2474 14.4922 7.36458 14.4922 7.5C14.4922 7.63542 14.4427 7.7526 14.3438 7.85156C14.2448 7.95052 14.1276 8 13.9922 8H7.99219V14C7.99219 14.1354 7.94271 14.2526 7.84375 14.3516C7.74479 14.4505 7.6276 14.5 7.49219 14.5C7.35677 14.5 7.23958 14.4505 7.14062 14.3516C7.04167 14.2526 6.99219 14.1354 6.99219 14V8H0.992188C0.856771 8 0.739583 7.95052 0.640625 7.85156C0.541667 7.7526 0.492188 7.63542 0.492188 7.5C0.492188 7.36458 0.541667 7.2474 0.640625 7.14844C0.739583 7.04948 0.856771 7 0.992188 7H6.99219V1C6.99219 0.864583 7.04167 0.747396 7.14062 0.648438C7.23958 0.549479 7.35677 0.5 7.49219 0.5Z" fill="#6264A7"/>
        </svg> ${addMoreOptionsKey}`);

        return false;
    }
}, '#add-questions');

/**
 * @event Click for cancel button on confirm box of question deletion
 */
$(document).on('click', '.cancel-question-delete', function () {
    $(this).parents('.question-container').find('.add-options').show();
    $(this).parents('.confirm-box').remove();
})

/**
 * @event Click for remove the Question from the section-2
 */
$(document).on({
    keydown: function(e){
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    },
    click: function(e){
        let element = $(this);
        $(this).parents('.question-container').find('.confirm-box').remove();
        $(this).parents('.question-container').find('.question-required-err').remove();

        if ($("div.question-container:visible").length > 1) {
            $(this).parents('.question-container').find('.add-options').hide();
            $(this).parents('.question-container').find('.form-group-opt').after(`
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
                scrollTop: $(this).parents('.question-container').find(".confirm-box").offset().top - 200
            }, 1000);

            $(this).parents('.question-container').find(".confirm-box #delete-question").focus();

            $(document).on("click", "#delete-question", function () {
                $(this).parents("div.question-container").remove();
                let questionCounter;
                $("div.question-container:visible").each(function (index, elem) {
                    questionCounter = index + 1;
                    $(elem).find("span.question-number").text('Question # ' + questionCounter);
                    $(elem).find('input[name="question_image"]').attr({ id: "question-image-" + questionCounter });
                    $(elem).attr({ id: "question" + questionCounter });
                });
            });
        } else {
            $(this).parents('div.question-container')
                .find("div.d-flex-ques")
                .after(`<label class="text-danger d-block question-required-err"><font class="mb--4 d-block">${forQuizAtleastOneQuestionKey}</font></label>`);

            $([document.documentElement, document.body]).animate({
                scrollTop: $(".text-danger.d-block:first").offset().top - 200
            }, 2000);
        }
    }
}, '.remove-question')

/** 
 * @event Click to add the Option under question
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
        e.preventDefault();
        if ($(this).parents("div#options").find("div.option-div input[type='text'][id^=option]").length >= 10) {
            $(this).parents('.question-container').find('.add-options').hide();
            $(this).parents('.question-container').find('.add-options').after(`
            <div class="max-option-err-box"> ${maxTenOptionKey} </div>
        `);

            $([document.documentElement, document.body]).animate({
                scrollTop: $(this).parents('.question-container').find(".max-option-err-box").offset().top - 200
            }, 1000);
            return false;
        }
        $(this).parents(".container").find("div.option-div:last").after(opt.clone());

        let selector = $(this).parents("div.container");
        $(selector)
            .find('div.option-div div.input-group input[type="text"]')
            .each(function (index, elem) {
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
        $('.check-me').text(checkMeKey);
        $('.check-me-title').attr({ "title": checkMeKey });
        return false;
    }
}, '.add-options');

/* $(document).on("click", ".add-options", function () {
    if ($(this).parents("div#options").find("div.option-div input[type='text'][id^=option]").length >= 10) {
        $(this).parents('.question-container').find('.add-options').hide();
        $(this).parents('.question-container').find('.add-options').after(`
            <div class="max-option-err-box"> ${maxTenOptionKey} </div>
        `);

        $([document.documentElement, document.body]).animate({
            scrollTop: $(this).parents('.question-container').find(".max-option-err-box").offset().top - 200
        }, 1000);
        return false;
    }
    $(this).parents(".container").find("div.option-div:last").after(opt.clone());

    let selector = $(this).parents("div.container");
    $(selector)
        .find('div.option-div div.input-group input[type="text"]')
        .each(function (index, elem) {
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
    $('.check-me').text(checkMeKey);
    $('.check-me-title').attr({ "title": checkMeKey });

});
 */

/**
 * @event keydown and Click for remove the Option
 */
/* $(document).on({
    keydown: function (e) {
        let key = e.which;
        if (key === 13 || key === 32) {
            $(this).parents('.rows').find('.remove-option').click();
            return false;
        }
    },
    click: function (e) {
        $(this).parents('.rows').find('.remove-option').click();
        return false;
    }
}, ".remove-option-href"); */

/**
 * @event Click for remove the Option
 */
$(document).on("click", ".remove-option", function (eve) {
    $(this).parents("div.question-container").find('.option-required-err').remove();
    
    /* Remove Error Message and show add option button */
    if ($(this).parents('.question-container').find('.max-option-err-box').length > 0) {
        $(this).parents('.question-container').find('.max-option-err-box').remove();
        $(this).parents('.question-container').find('.add-options').show();
    }

    if ($(this).parents("div.question-container").find("div.option-div").length > 2) {
        let selector = $(this).closest("div.container");
        $(this).parents("div.option-div").remove();

        $(selector)
            .find('div.option-div div.input-group input[type="text"]')
            .each(function (index, elem) {
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
        $(this).parents('div.question-container')
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
        }, 2000);
    }
});
 
/**
 * @event Click to Load setting page
 */
/* $(document).on("click", ".show-setting", function () {
    $(".section-1").hide();
    $(".section-1-footer").hide();
    $("form #setting").show();
});
 */

 /**
 * @event Click to Submit Quiz
 */
$(document).on("click", "#submit", function (e) {
    e.preventDefault();
    $("#submit").prop('disabled', true);
    $('.loader-overlay').show();
    $('.loader-overlay').show("fast", function () {
        submitForm();
    });
});

/**
 * @event Change on quiz title
 */
$(document).on("change", "#quiz-title", function () {
    if ($('#quiz-title').val().length > 0) {
        $('#next').prop('disabled', false);
        $(this).parents('.form-group').find('.label-alert.d-block:first').remove();
        $(this).removeClass('danger');
    }
});

/**
 * @event Click on clear button on training section
 */
$(document).on('click', '.quiz-clear', function () {
    $('.error-msg').remove();
    $('div.section-1 .photo-box').show();
    $('div.section-1 .quiz-updated-img').hide();
    $('div.section-2 .card-box:first #cover-image').val('');
    $('div.section-2 .card-box:first .quiz-updated-img').hide();
    $('.quiz-updated-img').removeClass('smallfit');
    $('.quiz-updated-img').removeClass('heightfit');
    $('.quiz-updated-img').removeClass('widthfit');
    $(this).hide();
    $('#quiz-attachment-id').remove();
    $('#quiz-attachment-set').remove();
});

/**
 * @event Click for next section at Quiz title and description page
 */
$(document).on("click", "#next", function () {
    let isError = false;
    $('.section-2').find('.question-required-err').remove();
    $('.section-2').find('.confirm-box').remove();

    $("form").find("input[type='text']").each(function () {
        let element = $(this);
        if (element.val() == "") {
            if (element.attr("id") == "quiz-title") {
                isError = true;
                $("#quiz-title").addClass("danger");
                $("#quiz-title").before(`<label class="label-alert d-block mb--4"><font class="required-key">${requiredKey}</font></label>`);
                $('#next').prop('disabled', true);
            }
        }
    });

    if (isError == false) {
        $('#next').prop('disabled', false);

        $(".section-1").hide();
        $(".section-1-footer").hide();

        if ($(".section-2.d-none").length > 0) {
            $(".section-2").removeClass('d-none');
        } else {
            $(".section-2").show();

        }
        if ($(".section-2-footer.d-none").length > 0) {
            $(".section-2-footer").removeClass('d-none');
        } else {
            $(".section-2-footer").show();
        }

        /* Populate Data on the question area */
        $('#quiz-title-content').html($('#quiz-title').val());
        $('#quiz-description-content').html($('#quiz-description').val());

    }
});

/**
 * @event Click event for back button
 */
/* $(document).on("click", "#back", function () {
    $(".section-1").show();
    $(".section-1-footer").show();

    $("form #setting").hide();
    $('#due').text(settingText);
}); */

/**
 * @event Event to back button on section 2
 */
$(document).on("click", "#back-section2", function () {
    $(".section-2").hide();
    $(".section-2-footer").hide();

    $(".section-1").show();
    $(".section-1-footer").show();
    $('.error-msg').remove();
});

/**
 * @event Change event for setting inputs
 */
$(document).on("change", "input[name='expiry_time'], input[name='expiry_date'], .visible-to, #show-correct-answer", function () {
    $('.invalid-date-err').remove();
    let end = new Date($('input[name="expiry_date"]').val() + ' ' + $('input[name="expiry_time"]').val());
    $('.text-danger').parent('div.col-12').remove();
    $('#back').removeClass('disabled');

    let start = new Date();
    let days = calcDateDiff(start, end);

    if (days == undefined || days == NaN) {
        $('.setting-section .row:first').append(`<div class="col-12 mt--32 invalid-date-err"><p class="text-danger">${invalidDateTimeKey}</p></div>`);
        $('#back').addClass('disabled');
    } else {
        let resultVisible = $('.visible-to:checked').val() == 'Everyone' ? resultEveryoneKey : resultMeKey;
        let correctAnswer = $('#show-correct-answer:eq(0)').is(":checked") == true ? correctAnswerKey : '';

        Localizer.getString('dueIn', days, correctAnswer).then(function (result) {
            settingText = result;
        });
    }
});

/**
 * @event keydown and Click event for correct answer inputs
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
        e.preventDefault();
        if ($(this).parents('div.col-12').find('input[type="checkbox"]').prop('checked') == false) {
            $(this).parents('div.col-12').find('input[type="checkbox"]').prop("checked", true);
            $(this).addClass('checked-112');
        } else {
            $(this).parents('div.col-12').find('input[type="checkbox"]').prop("checked", false);
            $(this).removeClass('checked-112');
        }
        return false;
    }
}, '.check-me-title');


$(document).on({
    keydown: function (e) {
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).find('.remove-option').click();
            return false;
        }
    }
}, '.remove-option-href');

/**
 * @event Event when click on class then open hidden file
 */
$(document).on('click', '.upvj', function (event) {
    event.preventDefault();
    if ($(this).parents('div.section-1').length > 0) {
        $('.section-2').find('div.card-box:first').find('input[type="file"]').click();
    } else {
        $('.section-2').find('div.card-box:last').find('input[type="file"]').click();
    }
})

/**
 * @event Event to show trash on focusin at input
 */
$(document).on('focusin', '.option-div, .input-group-append, .input-group, .input-group input[type="text"], .input-tpt, .input-tpt .remove-option', function () {
    $(this).parents('div.row').find('.remove-option').show();
});

/**
 * @event Event to hide trash on focusout at input
 */
$(document).on('focusout', '.option-div, .input-tpt, .input-tpt .remove-option, .check-me-title, .input-group input[type="text"]', function () {
    $(this).parents('div.row').find('.remove-option').hide();
});

/**
 * @event Event to show trash on focusin at input
 */
$(document).on('hover', '.remove-option', function () {
    $(this).show();
});


/**
 * @event Event when quiz cover image changes
 */
$(document).on('change', '#cover-image', function () {
    $('.error-msg').remove();
    $('.invalid-image-format').remove();
    let urlResponse = readURL(this, '#quiz-img-preview, #quiz-title-image');
    if (urlResponse == true){
        $('.photo-box').hide();
        $('.quiz-updated-img').show();
        $('.quiz-updated-img').show();
        $('#quiz-title-image').show();
        $('.quiz-updated-img').show();
        $('.quiz-clear').show();

        /* Perform image upload for quiz template */
        // if ($('#quiz-title-image').attr('src').length > 0) {
            let fileData = this;
            if ($(fileData).val() != '') {
                let coverImage = fileData.files[0];
                
                let attachment = ActionHelper.attachmentUpload(coverImage, coverImage['type']);
                let attachmentRequest = {};
                if (!$('#submit').hasClass('disabled')) {
                    $('#submit').addClass('disabled');
                    $('#submit').prepend(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
                }
                attachmentRequest = ActionHelper.requestAttachmentUploadDraft(attachment);
                ActionHelper.executeApi(attachmentRequest)
                    .then(function (response) {
                        let attachmentData = { 'name': 'quiz-banner', type: 'Image', id: response.attachmentId };
                        attachmentSet.push(attachmentData);
                        if ($('#quiz-attachment-set').length > 0) {
                            $('#quiz-attachment-id').val(response.attachmentId);
                            $('#quiz-attachment-set').val(JSON.stringify(attachmentData));
                        } else {
                            $(fileData).after('<textarea id="quiz-attachment-id" class="d-none">' + response.attachmentId + '</textarea>');
                            $(fileData).after('<textarea id="quiz-attachment-set" class="d-none">' + JSON.stringify(attachmentData) + '</textarea>');
                        }
                        $('#submit').removeClass('disabled');
                        $('#submit').find(`.spinner-border.spinner-border-sm`).remove();
                    })
                    .catch(function (error) {
                        console.log("GetContext - Error2: " + JSON.stringify(error));
                    });
            }
    }else{
        $('.photo-box').parent('div').before(`<label class="label-alert pull-right d-block mt--8 invalid-image-format">
                    <font>Invalid file format passed</font>
                </label>`);
    }

});

/**
 * @event Kepress and Click when question cover image changes
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
        e.preventDefault();
        $(this).parents('.input-group').find('input[type="file"]').click();
        return false;
    }
}, '.question-image, .option-image');

/* $(document).on('click', '.question-image, .option-image', function () {
}); */


/**
 * @event Event when question cover image changes
 */
$(document).on('change', 'input[name="question_image"]', function () {
    $('.invalid-file-question').remove();
    let urlReturn = readURL(this, $(this).parents('div.form-group-question').find('.question-preview-image'));
    if (urlReturn == true){
        $(this).parents('div.form-group-question').find('.question-preview-image').show();
        $(this).parents('div.form-group-question').find('.question-preview').show();
        
        /* Perform image upload for question image */
        let fileData = this;
        if ($(fileData).val() != '') {
            if (!$('#submit').hasClass('disabled')) {
                $('#submit').addClass('disabled');
                $('#submit').prepend(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
            }
            let coverImage = fileData.files[0];
            let attachment = ActionHelper.attachmentUpload(coverImage, coverImage['type']);
            let attachmentRequest = ActionHelper.requestAttachmentUploadDraft(attachment);
            let imgIndex = $(this).attr('id');
            ActionHelper.executeApi(attachmentRequest)
                .then(function (response) {
                    let attachmentData = { 'name': 'question-banner-' + imgIndex, type: 'Image', id: response.attachmentId };
                    let selector = $(this).parents('.question-container').attr('id');
                    if ($('#' + selector).find('#question-attachment-id').length > 0) {
                        $('#' + selector).find('#question-attachment-id').val(response.attachmentId);
                        $('#' + selector).find('#question-attachment-set').val(JSON.stringify(attachmentData));
                    } else {
                        $(fileData).after('<textarea id="question-attachment-id" class="d-none" >' + response.attachmentId + '</textarea>');
                        $(fileData).after('<textarea id="question-attachment-set" class="d-none" >' + JSON.stringify(attachmentData) + '</textarea>');
                    }
                    $('#submit').removeClass('disabled');
                    $('#submit').find(`.spinner-border.spinner-border-sm`).remove();
                })
                .catch(function (error) {
                    console.log("GetContext - Error3: " + JSON.stringify(error));
                });
        }
    }else{
        $('.question-preview-image').attr('src', '');
        $('.question-preview').hide();
        $(this).parents('.form-group-question').find('.question-preview').before(`<label class="label-alert d-block mb--4 invalid-file-question"><font class="question-blank-key">Invalid file format passed</font></label>`);
        $(this).parents('div.input-group-append').find('#question-attachment-id').remove();
        $(this).parents('div.input-group-append').find('#question-attachment-set').remove();
    }
});

/**
 * @event Event when option cover image changes
 */
$(document).on('change', 'input[name="option_image"]', function () {
    $('.invalid-file-option').remove();
    let urlReturn = readURL(this, $(this).parents('div.row').find('.option-preview-image'));
    $(this).parents('div.row').find('.option-preview-image').show();
    $(this).parents('div.row').find('div.option-preview').show();
    if (urlReturn == true) {
        let fileData = this;
        if ($(fileData).val() != '') {
            if (!$('#submit').hasClass('disabled')){
                $('#submit').addClass('disabled');
                $('#submit').prepend(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
            }
            let coverImage = fileData.files[0];
            let attachment = ActionHelper.attachmentUpload(coverImage, coverImage['type']);
            let attachmentRequest = ActionHelper.requestAttachmentUploadDraft(attachment);
            let imgIndex = $(this).attr('id');
            ActionHelper.executeApi(attachmentRequest)
                .then(function (response) {
                    let attachmentData = { 'name': 'option-banner-' + imgIndex, type: 'Image', id: response.attachmentId };
                    let selector = $(this).parents('.row');
                    if ($(selector).find('textarea#option-attachment-id').length > 0) {
                        $(selector).find('textarea#option-attachment-id').val(response.attachmentId);
                        $(selector).find('textarea#option-attachment-set').val(JSON.stringify(attachmentData));
                    } else {
                        $(fileData).after('<textarea id="option-attachment-id" class="d-none" >' + response.attachmentId + '</textarea>');
                        $(fileData).after('<textarea id="option-attachment-set" class="d-none" >' + JSON.stringify(attachmentData) + '</textarea>');
                    }
                    $('#submit').removeClass('disabled');
                    $('#submit').find(`.spinner-border.spinner-border-sm`).remove();
                })
                .catch(function (error) {
                    console.log("GetContext - Error4: " + JSON.stringify(error));
                });
        }
    }else{
        $('.option-preview-image').attr('src', '');
        $('.option-preview').hide();
        $(this).parents('div.option-div').prepend(`<label class="label-alert d-block mb--4 invalid-file-option"><font class="question-blank-key">Invalid file format passed</font></label>`);
        $(this).parents('div.option-div').find('#question-attachment-id').remove();
        $(this).parents('div.option-div').find('#question-attachment-set').remove();
    }
});


$(document).on('keydown', 'input, textarea', function(e){
    let key = e.which;
    if(key == 13){
        return false;
    }
})

$(document).on('keydown', '.photo-box-href', function(e){
    let key = e.which;
    if (key == 13) {
        return false;
    }

    if (key == 32) {
        e.preventDefault();
        if ($(this).parents('div.section-1').length > 0) {
            $('.section-2').find('div.card-box:first').find('input[type="file"]').click();
        } else {
            $('.section-2').find('div.card-box:last').find('input[type="file"]').click();
        }
    }
})

$(document).on({
    keydown: function(e){
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $('.quiz-clear').get(0).click();
            return false;
        }
    },
    click: function(e){
        e.preventDefault();
        $('.quiz-clear').get(0).click();
        return false;
    }
}, '.clear-key-href');

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
        e.preventDefault();
        $(".section-1").hide();
        $(".section-1-footer").hide();
        $("form #setting").show();
        return false;
    }
}, '.show-setting');


$(document).on({
    keydown: function (e) {
        e.preventDefault();
        let key = e.which;
        if (key === 13 || key === 32) {
            e.preventDefault();
            $(this).click();
            return false;
        }
    },
    click: function(e) {
        $(".section-1").show();
        $(".section-1-footer").show();
        e.preventDefault();

        $("form #setting").hide();
        $('#due').text(settingText);
        return false;
    }
}, '#back');

$(document).on('keydown', '.clear-key-href', function(e){
    let key = e.which;
    if (key === 13) {
        e.preventDefault();
        $('.quiz-clear').click();
        return false;
    }
});



/* ****************************** Method ************************************* */
/**
 * @description Method for quiz data and submit the datas
 */
function submitForm() {
    /* Validate */
    let errorText = "";
    // $('.loader-overlay').show();

    $("input[type='text']").removeClass("danger");
    $("label.label-alert").remove();
    $("div.card-box-alert").removeClass("card-box-alert").addClass("card-box");
    $('.section-2').find('.question-required-err').remove();
    $('.section-2').find('.confirm-box').remove();

    $('.question-container:visible').each(function (qind, quest) {
        let isChecked = false;
        $(quest).find('#options').find('input[type="checkbox"]').each(function (optind, opt) {
            if ($(opt).prop('checked') == true) {
                isChecked = true;
            }
        });

        if (isChecked != true) {
            let questionId = $(quest).attr('id');
            $("#" + questionId)
                .find("div.d-flex-ques")
                .after(`<div class="clearfix"></div>
                    <label class="label-alert d-block option-required-err text-left pull-left mt--8 mb--16"><font>${selectCorrectChoiceKey}</font></label>
                    <div class="clearfix"></div>`);

            $("#submit").prop('disabled', false);


            $("#" + questionId)
                .find("div.card-box")
                .removeClass("card-box")
                .addClass("card-box-alert");
            errorText += 'Option check required';

            $([document.documentElement, document.body]).animate({
                scrollTop: $(".option-required-err:last").offset().top - 200
            }, 1000);
        }
    });


    $("form")
        .find("input[type='text']")
        .each(function () {
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
                    if ($(element).parents('div.form-group-question').find('img.question-preview-image').attr('src') != "") {
                        // Do nothing
                    } else {
                        if ($(this).find("div.card-box").length > 0) {
                            $(this).parents("div.card-box").removeClass("card-box").addClass("card-box-alert");
                        }
                        $(element).addClass("danger");
                        Localizer.getString('questionLeftBlank').then(function (result) {
                            $('.question-blank-key').text(result);
                            $(element)
                                .parents("div.form-group-question").find('.question-number').parent('div')
                                .after(
                                    `<label class="label-alert d-block mb--4"><font class="question-blank-key">${result}</font></label>`
                                );
                        });

                        errorText += "<p>Question cannot not left blank.</p>";
                        $(element).addClass("danger");
                    }
                } else if (element.attr("id").startsWith("option")) {
                    if ($(element).parents('div.radio-outer').find('img.option-preview-image').attr('src') != "") {
                        // Do nothing
                    } else {
                        if ($(this).find("div.card-box").length > 0) {
                            $(this).parents("div.card-box").removeClass("card-box").addClass("card-box-alert");
                        }
                        $(this).addClass("danger");
                        $(this)
                            .parents("div.col-12").parents("div.option-div")
                            .prepend(
                                `<label class="label-alert d-block mb--4"><font class="required-key">${requiredKey}</font></label>`
                            );

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
            .then(function (response) {
                // uploadImages().then(function () {
                    createAction(response.context.actionPackageId);
                // });
            })
            .catch(function (error) {
                console.error("GetContext - Error1: " + JSON.stringify(error));
            });


    } else {

        $('.loader-overlay').hide();
        $('.required-key').text(requiredKey);
        $("#submit").prop('disabled', false);
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
        let optionType = ActionHelper.getColumnType('singleselect');
        let option = [];
        let isSelected = 0;
        // let questionAttachmentId = $("#question" + i).find('textarea#question-attachment-id').length > 0 ? $("#question" + i).find('textarea#question-attachment-id').val() : '';
        let questionAttachmentSet = $("#question" + i).find('textarea#question-attachment-set').length > 0 ? JSON.parse($("#question" + i).find('textarea#question-attachment-set').val()) : '';

        /* Looping for options */
        $("#question" + i)
            .find("div.option-div")
            .each(function (index, elem) {
                let count = index + 1;
                let optId = "question" + i + "option" + count;
                let optTitle = $("#question" + i).find("#option" + count).val();
                let optionAttachmentSet = $("#question" + i).find("#option" + count).parents('div.option-div').find('textarea#option-attachment-set').length > 0 ? JSON.parse($("#question" + i).find("#option" + count).parents('div.option-div').find('textarea#option-attachment-set').val()) : '';

                if ($("#question" + i).find("#check" + count).is(":checked")) {
                    // if it is checked
                    isSelected++;
                }

                if ($("#question" + i).find("input[type=checkbox]:checked").length > 1) {
                    optionType = ActionHelper.getColumnType('multiselect');
                } else {
                    optionType = ActionHelper.getColumnType('singleselect');
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
                .after(`<div class="clearfix"></div>
                    <label class="label-alert d-block option-required-err text-left pull-left mt--8 mb--16"><font>${selectCorrectChoiceKey}</font></label>
                    <div class="clearfix"></div>`);

            $("#submit").prop('disabled', false);


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
            .each(function (index, elem) {
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
 * @description Method to upload image to server
 */
function uploadImages() {
    let imageCounter = 0;
    let dfd = $.Deferred();
    let totalImageUpload = 0;
    $('input[type="file"]').each(function (imgIndex, fileData) {
        if ($(fileData).val() != '') {
            totalImageUpload++;
        }
    });
   

    let tid = setInterval(() => {
        if (imageCounter >= totalImageUpload) {
            dfd.resolve();
            clearInterval(tid);
        }
    }, 100);

    return $.when(dfd).done(function () {

    }).promise();

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
    let quizAttachementId = $('#quiz-attachment-id').length > 0 ? $('#quiz-attachment-id').val() : '';
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
        type: "LargeText",
        value: quizDescription,
    }, {
        name: "Quiz Expire Date Time",
        type: "DateTime",
        value: new Date(quizExpireDate + " " + quizExpireTime),
    }, {
        name: "Result Visible",
        type: "Text",
        value: resultVisible,
    }, {
        name: "Show Correct Answer",
        type: "Text",
        value: showCorrectAnswer,
    }, {
        name: "Attachment Id",
        type: "LargeText",
        value: quizAttachementId,
    });
    properties.push(getcorrectanswers);

    let action = {
        id: generateGUID(),
        actionPackageId: actionPackageId,
        version: 1,
        displayName: quizTitle,
        description: quizDescription,
        expiryTime: new Date(quizExpireDate + " " + quizExpireTime).getTime(),
        customProperties: properties,
        dataTables: [{
            name: "TestDataSet",
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
        .then(function (response) {
            console.info("CreateAction - Response: " + JSON.stringify(response));
        })
        .catch(function (error) {
            console.error("CreateAction - Error: " + JSON.stringify(error));
        });
}

/**
 * @description Method to generate GUID
 */
function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Initiate Method
 */
$(document).ready(function () {
    request = ActionHelper.getContextRequest();
    getStringKeys();
    getTheme(request);
});

/**
 * @description Async method for fetching localization strings
 */
async function getStringKeys() {
    Localizer.getString('quizTitle').then(function (result) {
        $('#quiz-title').attr({ 'placeholder': result });
    });

    Localizer.getString('quizDescription').then(function (result) {
        $('#quiz-description').attr({ 'placeholder': result });
    });

    Localizer.getString('enterTheQuestion').then(function (result) {
        $('#question-title').attr({ 'placeholder': result });
        questionTitleKey = result;
    });

    Localizer.getString('option', '').then(function (result) {
        optionKey = result;
        $('.opt-cls').attr('placeholder', optionKey)
    });
    Localizer.getString('dueIn', ' 1 week', ', Correct answer shown after every question').then(function (result) {
        settingText = result;
        $('#due').text(settingText);
    });

    Localizer.getString('addMoreOptions').then(function (result) {
        addMoreOptionsKey = result;
        $('.add-options').html(`
            <svg width="16" height="16" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"  class="cc gs gt tc gv">
                <path d="M7.49219 0.5C7.6276 0.5 7.74479 0.549479 7.84375 0.648438C7.94271 0.747396 7.99219 0.864583 7.99219 1V7H13.9922C14.1276 7 14.2448 7.04948 14.3438 7.14844C14.4427 7.2474 14.4922 7.36458 14.4922 7.5C14.4922 7.63542 14.4427 7.7526 14.3438 7.85156C14.2448 7.95052 14.1276 8 13.9922 8H7.99219V14C7.99219 14.1354 7.94271 14.2526 7.84375 14.3516C7.74479 14.4505 7.6276 14.5 7.49219 14.5C7.35677 14.5 7.23958 14.4505 7.14062 14.3516C7.04167 14.2526 6.99219 14.1354 6.99219 14V8H0.992188C0.856771 8 0.739583 7.95052 0.640625 7.85156C0.541667 7.7526 0.492188 7.63542 0.492188 7.5C0.492188 7.36458 0.541667 7.2474 0.640625 7.14844C0.739583 7.04948 0.856771 7 0.992188 7H6.99219V1C6.99219 0.864583 7.04167 0.747396 7.14062 0.648438C7.23958 0.549479 7.35677 0.5 7.49219 0.5Z" fill="#6264A7"/>
            </svg> ${addMoreOptionsKey}`);
    });

    Localizer.getString('choices').then(function (result) {
        choicesKey = result;
        $('.choice-label').text(choicesKey);
    });

    Localizer.getString('checkMe').then(function (result) {
        checkMeKey = result;
        $('.check-me').text(checkMeKey);
        $('.check-me-title').attr({ "title": checkMeKey });
    });

    Localizer.getString('next').then(function (result) {
        nextKey = result;
        $('.next-key').text(nextKey);
    });

    Localizer.getString('back').then(function (result) {
        backKey = result;
        $('.back-key').text(backKey);
    });

    Localizer.getString('required').then(function (result) {
        requiredKey = result;
        $('.required-key').text(requiredKey);
    });

    Localizer.getString('dueBy').then(function (result) {
        dueByKey = result;
        $('.due-by-key').text(dueByKey);
    });

    Localizer.getString('resultVisibleTo').then(function (result) {
        resultVisibleToKey = result;
        $('.result-visible-key').text(resultVisibleToKey);
    });

    Localizer.getString('resultEveryone').then(function (result) {
        resultEveryoneKey = result;
    });

    Localizer.getString('resultMe').then(function (result) {
        resultMeKey = result;
    });

    Localizer.getString('correctAnswer', ', ').then(function (result) {
        correctAnswerKey = result;
    });

    Localizer.getString('everyone', ', ').then(function (result) {
        everyoneKey = result;
        $('.everyone-key').text(everyoneKey);
    });

    Localizer.getString('onlyMe', ', ').then(function (result) {
        onlyMeKey = result;
        $('.onlyme-key').text(onlyMeKey);
    });

    Localizer.getString('showCorrectAnswer').then(function (result) {
        showCorrectAnswerKey = result;
        $('.show-correct-key').text(showCorrectAnswerKey);
    });

    Localizer.getString('answerCannotChange').then(function (result) {
        answerCannotChangeKey = result;
        $('.answer-cannot-change-key').text(answerCannotChangeKey);
    });

    Localizer.getString('invalidDateTime').then(function (result) {
        invalidDateTimeKey = result;
    });

    Localizer.getString('sureDeleteThis').then(function (result) {
        sureDeleteThisKey = result;
    });

    Localizer.getString('ok').then(function (result) {
        okKey = result;
    });

    Localizer.getString('cancel').then(function (result) {
        cancelKey = result;
    });

    Localizer.getString('forQuizAtleastOneQuestion').then(function (result) {
        forQuizAtleastOneQuestionKey = result;
    });

    Localizer.getString('maxTenOption').then(function (result) {
        maxTenOptionKey = result;
    });

    Localizer.getString('atLeastTwoOptionsRequired').then(function (result) {
        atLeastTwoOptionsRequiredKey = result;
    });

    Localizer.getString('questionLeftBlank').then(function (result) {
        questionLeftBlankKey = result;
        $('.question-blank-key').text(result);
    });

    Localizer.getString('selectCorrectChoice').then(function (result) {
        selectCorrectChoiceKey = result;
    });

    Localizer.getString('addQuestion').then(function (result) {
        addQuestionKey = result;
        $('.add-question-key').text(addQuestionKey)
    });

    Localizer.getString('uploadCoverImage').then(function (result) {
        uploadCoverImageKey = result;
        $('.upload-cover-image-key').text(uploadCoverImageKey)
    });

    Localizer.getString('coverImage').then(function (result) {
        coverImageKey = result;
        $('.cover-image-key').text(coverImageKey)
    });

    Localizer.getString('clear').then(function (result) {
        clearKey = result;
        $('.clear-key').text(clearKey)
    })
}

/**
 * @description Method to select theme based on the teams theme  
 * @param request context request
 */
async function getTheme(request) {
    let response = await ActionHelper.executeApi(request);
    let context = response.context;

    lastSession = context.lastSessionData;
    let theme = context.theme;
    $('.body-outer').before(loader);

    $("link#theme").attr("href", "css/style-" + theme + ".css");

    /* if (context.hostClientType == "ios"){
        $("link#theme").after('<link href="css/style-ios-' + theme + '.css" rel="stylesheet" id="theme" />')
    } */

    $('form.sec1').append(formSection);
    $('form.sec1').append(section2);
    $('form.sec1').after(settingSection);
    $('form.sec1').after(optionSection);
    $('form.sec1').after(questionsSection);
    getStringKeys();
    questionSection = $("#question-section div.container").clone();
    opt = $("div#option-section .option-div").clone();
    let weekDateFormat;
    let currentTime;

    /* If Edit back the quiz */
    if (lastSession != null) {
        let actionId = lastSession.action.id;
        let ddtt = ((lastSession.action.customProperties[1].value).split('T'));
        let dt = ddtt[0].split('-');
        weekDateFormat = new Date(dt[1]).toLocaleString('default', { month: 'short' }) + " " + dt[2] + ", " + dt[0];
        let timeData = new Date(lastSession.action.expiryTime);
        let hourData = timeData.getHours();
        let minuteData = timeData.getMinutes();
        currentTime = hourData + ':' + minuteData;   
        if (lastSession.action.customProperties[2].value == 'Everyone') {
            $('input[name="visible_to"][value="Everyone"]').prop("checked", true);
        } else {
            $('input[name="visible_to"][value="Only me"]').prop("checked", true);
        }
        if (lastSession.action.customProperties[3].value == 'Yes') {
            $('#show-correct-answer').prop("checked", true);
        } else {
            $('#show-correct-answer').prop("checked", false);
        }

        /* Quiz Section */
        $('#quiz-title').val(lastSession.action.displayName);
        $('#quiz-description').val(lastSession.action.customProperties[0].value);

        /* Quiz Section Attachment Check */
        if (lastSession.action.customProperties[4].value != "") {
            let attachmentData = lastSession.action.dataTables[0].attachments[0];
            attachmentSet.push(attachmentData);
            let req = ActionHelper.getAttachmentInfoDraft(attachmentData.id);
            ActionHelper.executeApi(req).then(function (response) {
                $('#quiz-img-preview, #quiz-title-image').attr("src", response.attachmentInfo.downloadUrl);
                $('.photo-box').hide();
                $('.quiz-updated-img').show();
                $('.quiz-updated-img').show();
                $('#quiz-title-image').show();
                $('.quiz-updated-img').show();
                $('.quiz-clear').show();
                $('#cover-image').after('<textarea id="quiz-attachment-id" class="d-none">' + response.attachmentInfo.id + '</textarea>');
                $('#cover-image').after('<textarea id="quiz-attachment-set" class="d-none">' + JSON.stringify(attachmentData) + '</textarea>');
            })
                .catch(function (error) {
                    console.error("AttachmentAction - Error101: " + JSON.stringify(error));
                });
        }

        /* Due Setting String */
        let end = new Date(weekDateFormat + ' ' + currentTime);
        let start = new Date();
        let days = calcDateDiff(start, end);

        let resultVisible = lastSession.action.customProperties[2].value == 'Everyone' ? resultEveryoneKey : resultMeKey;
        let correctAnswer = lastSession.action.customProperties[3].value == 'Yes' ? correctAnswerKey : '';

        Localizer.getString('dueIn', days, correctAnswer).then(function (result) {
            settingText = result;
            $('#due').text(settingText);
        });

    } else {
        let weekDate = new Date(new Date().setDate(new Date().getDate() + 7))
            .toISOString()
            .split("T")[0];

        let weekMonth = new Date(weekDate).toLocaleString('default', { month: 'short' });
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
    }, 1000);

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
    await ActionHelper.hideLoader();

    if (lastSession != null) {
        let actionId = lastSession.action.id;
        // setTimeout(() => {
        let option = $("div#option-section .option-div").clone();
        lastSession.action.dataTables[0].dataColumns.forEach((e, ind) => {
            let correctAnsArr = JSON.parse(lastSession.action.customProperties[5].value);
            if (ind == 0) {
                let questionTitleData = e.displayName;
                let questionAttachmentData = e.attachments.length > 0 ? e.attachments[0].id : '';
                $('#question1').find('#question-title').val(questionTitleData);
                if (questionAttachmentData != "") {
                    let attachmentData = e.attachments[0];
                    let req = ActionHelper.getAttachmentInfoDraft(questionAttachmentData);
                    ActionHelper.executeApi(req).then(function (response) {
                        $('#question1').find('.question-preview').show()
                        $('#question1').find('.question-preview-image').show()
                        $('#question1').find('.question-preview-image').attr("src", response.attachmentInfo.downloadUrl);
                        $('#question-image-1').after('<textarea id="question-attachment-id" class="d-none">' + response.attachmentInfo.id + '</textarea>');
                        $('#question-image-1').after('<textarea id="question-attachment-set" class="d-none">' + JSON.stringify(attachmentData) + '</textarea>');
                    })
                        .catch(function (error) {
                            console.error("AttachmentAction - Error102: " + JSON.stringify(error));
                        });
                }

                e.options.forEach((opt, i) => {
                    let counter = i + 1;
                    let optionName = opt.displayName;
                    let optionAttachment = opt.attachments.length > 0 ? opt.attachments[0].id : '';
                    if (i <= 1) {
                        $('#question1').find('#option' + counter).val(optionName);
                    } else {
                        $('#question1').find("div.option-div:last").after(option.clone());
                        $('#question1').find("div.option-div:last input[type='text']").attr({
                            placeholder: optionKey,
                        });
                        $('#question1').find("div.option-div:last input[type='text']").attr({ id: "option" + counter }).val(optionName);
                        $('#question1').find("div.option-div:last input[type='text']")
                            .parents(".option-div")
                            .find("input[type='image']")
                            .attr({ id: "option-image-" + counter });
                        $('#question1').find("div.option-div:last input[type='text']")
                            .parents(".option-div")
                            .find("input.form-check-input")
                            .attr({ id: "check" + counter });
                    }

                    $.each(correctAnsArr, function (cindex, cAns) {
                        if ($.inArray("question1option" + counter, cAns) != -1) {
                            $('#question1').find('#check' + counter).prop('checked', true);
                            $('#question1').find('#option' + counter).parents('div.input-group.input-group-tpt.mb--8').find('.check-me-title').addClass('checked-112');
                        }
                    });
                    if (optionAttachment != "") {
                        let req = ActionHelper.getAttachmentInfoDraft(optionAttachment);
                        ActionHelper.executeApi(req).then(function (response) {
                            let attachmentData = opt.attachments[0];
                            $('#question1').find('#option' + counter).parents('div.col-12').find('.option-preview').show()
                            $('#question1').find('#option' + counter).parents('div.col-12').find('.option-preview-image').show()
                            $('#question1').find('#option' + counter).parents('div.col-12').find('.option-preview-image').attr("src", response.attachmentInfo.downloadUrl);
                            $('#question1').find('#option-image-' + counter).after('<textarea id="option-attachment-id" class="d-none">' + response.attachmentInfo.id + '</textarea>');
                            $('#question1').find('#option-image-' + counter).after('<textarea id="option-attachment-set" class="d-none">' + JSON.stringify(attachmentData) + '</textarea>');
                        })
                            .catch(function (error) {
                                console.error("AttachmentAction - Error104: " + JSON.stringify(error));
                            });
                    }
                });
            } else {
                let qcounter = ind + 1;
                $(".section-2").find('#add-questions').parents("div.container").before($('#question-section').html());

                let ocounter = 0;
                let questionTitleData = e.displayName;
                let questionAttachmentData = e.attachments.length > 0 ? e.attachments[0].id : '';
                $(".section-2").find("div.container.question-container:last").attr('id', 'question' + qcounter);
                Localizer.getString('question').then(function (result) {
                    $("#question" + qcounter).find("span.question-number").text(result + ' # ' + qcounter);
                })

                $('#question' + qcounter).find('#question-title').val(questionTitleData);

                if (questionAttachmentData != "") {
                    let req = ActionHelper.getAttachmentInfoDraft(questionAttachmentData);
                    ActionHelper.executeApi(req).then(function (response) {
                        let attachmentData = e.attachments[0];
                        $('#question' + qcounter).find('.question-preview').show()
                        $('#question' + qcounter).find('.question-preview-image').show()
                        $('#question' + qcounter).find('.question-preview-image').attr("src", response.attachmentInfo.downloadUrl);
                        $('#question-image-' + qcounter).after('<textarea id="question-attachment-id" class="d-none">' + response.attachmentInfo.id + '</textarea>');
                        $('#question-image-' + qcounter).after('<textarea id="question-attachment-set" class="d-none">' + JSON.stringify(attachmentData) + '</textarea>');
                    })
                        .catch(function (error) {
                            console.error("AttachmentAction - Error105: " + JSON.stringify(error));
                        });
                }

                Localizer.getString('enterTheQuestion').then(function (result) {
                    $("div.container.question-container:visible:last").find('input[type="text"]').attr({
                        placeholder: result,
                    });
                });
                e.options.forEach((opt, i) => {
                    ocounter = i + 1;
                    let optionName = opt.displayName;
                    let optionAttachment = opt.attachments.length ? opt.attachments[0].id : '';
                    if (i <= 1) {
                        $('#question' + qcounter).find('#option' + ocounter).val(optionName);
                    } else {
                        $('#question' + qcounter).find("div.option-div:last").after(option.clone());
                        $('#question' + qcounter).find("div.option-div:visible:last input[type='text']").attr({
                            placeholder: optionKey,
                        });
                        $('#question' + qcounter).find("div.option-div:last input[type='text']").attr({ id: "option" + ocounter }).val(optionName);
                        $('#question' + qcounter).find("div.option-div:last input[type='file']").attr({ id: "option-image-" + ocounter });
                        $('#question' + qcounter).find("div.option-div:last input[type='text']")
                            .parents(".option-div")
                            .find("input.form-check-input")
                            .attr({ id: "check" + ocounter });
                    }
                    $.each(correctAnsArr, (cindex, cAns) => {
                        if ($.inArray("question" + qcounter + "option" + ocounter, cAns) != -1) {
                            $('#question' + qcounter).find('#check' + ocounter).prop('checked', true);
                            $('#question' + qcounter).find('#option' + ocounter).parents('div.input-group.input-group-tpt.mb--8').find('.check-me-title').addClass('checked-112');
                        }
                    });

                    if (optionAttachment != "") {
                        let req = ActionHelper.getAttachmentInfoDraft(optionAttachment);
                        ActionHelper.executeApi(req).then(function (response) {
                            let attachmentData = opt.attachments[0];
                            $('#question' + qcounter).find('#option' + ocounter).parents('div.col-12').find('.option-preview').show()
                            $('#question' + qcounter).find('#option' + ocounter).parents('div.col-12').find('.option-preview-image').show()
                            $('#question' + qcounter).find('#option' + ocounter).parents('div.col-12').find('.option-preview-image').attr("src", response.attachmentInfo.downloadUrl);
                            $('#question' + qcounter).find('#option-image-' + counter).after('<textarea id="option-attachment-id" class="d-none">' + response.attachmentInfo.id + '</textarea>');
                            $('#question' + qcounter).find('#option-image-' + counter).after('<textarea id="option-attachment-set" class="d-none">' + JSON.stringify(attachmentData) + '</textarea>');
                        })
                            .catch(function (error) {
                                console.error("AttachmentAction - Error106: " + JSON.stringify(error));
                            });
                    }
                });
            }
        });
        // }, 1000);
    }
}

/**
 * @description Method for calculating date diff from current date in weeks, days, hours, minutes
 * @param start - Date type
 * @param end - Date type
 */
function calcDateDiff(start, end) {
    let days = (end - start) / (1000 * 60 * 60 * 24);
    let hourText = 'hour';
    let minuteText = 'minute';
    if (days > 6) {
        let weeks = Math.ceil(days) / 7;
        return Math.floor(weeks) + ' week';
    } else {
        if (days < 1) {
            let t1 = start.getTime();
            let t2 = end.getTime();

            let minsDiff = Math.floor((t2 - t1) / 1000 / 60);
            let hourDiff = Math.floor(minsDiff / 60);
            minsDiff = minsDiff % 60;

            if (hourDiff > 1) {
                hourText = 'hours';
            } else {
                hourText = 'hour';
            }
            if (hourDiff > 1) {
                minuteText = 'minutes';
            } else {
                minuteText = 'minute';
            }
            if (hourDiff > 0 && minsDiff > 0) {
                return hourDiff + ' ' + hourText + ', ' + minsDiff + ' ' + minuteText;
            } else if (hourDiff > 0 && minsDiff <= 0) {
                return hourDiff + ' ' + hourText;
            } else if (hourDiff <= 0 && minsDiff > 0) {
                return minsDiff + ' ' + minuteText;
            }
        } else {
            return Math.ceil(days) + ' days';
        }
    }
}

/**
 * Method to get base64 data of file
 * @param input object html file type input element
 * @param elem object html elem where preview need to show
 */
function readURL(input, elem) {
    let fileTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp']; 
    let isSuccess = false;
    $(elem).removeClass('heightfit');
    $(elem).removeClass('widthfit');
    $(elem).removeClass('smallfit');
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        let extension = input.files[0].name.split('.').pop().toLowerCase();
        isSuccess = fileTypes.indexOf(extension) > -1;
        if (isSuccess) {
            reader.onload = function (e) {
                let image = new Image();
                image.src = e.target.result;

                image.onload = function () {
                    let imgWidth = this.width;
                    let imgHeight = this.height;
                    let divWidth = $(elem).width();
                    let divHeight = $(elem).height();
                    $(elem).attr('src', this.src);

                    if (elem != '#quiz-img-preview, #quiz-title-image') {
                        if (imgHeight > divHeight) {
                            /* height is greater than width */
                            $(elem).addClass('heightfit');
                        } else if (imgWidth > divWidth) {
                            /* width is greater than height */
                            $(elem).addClass('widthfit');
                        } else {
                            /* small image */
                            $(elem).addClass('smallfit');
                        }
                    }
                };
            };
        }else{
            return false;
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
    return true;
}


/********************************************   HTML Sections  ***********************************************************/
/**
 * @description Quiz Landing Page
 */
let formSection = `<div class="section-1">
            <div class="container">
                <div id="root">
                    <div class="form-group mb--16">
                        <input type="Text" placeholder="" class="in-t input-title form-control" id="quiz-title" maxlength="1000"/>
                    </div>
                    <div class="form-group mb--16">
                        <textarea class="form-control in-t font-12" id="quiz-description" maxlength="5000"></textarea>
                    </div>
                    <div class="form-group mb0">
                        <label class="cover-image-label semi-bold mb--8 font-12 cover-image-key">${coverImageKey}</label>
                        <label class="quiz-clear semi-bold mb--8 cursor-pointer pull-right theme-color font-12 clear-key-href clear-key" style="display:none" tabindex="0" role="button">${clearKey}</label>
                        <div class="relative">
                            <!-- hide this div after img added -->
                            <div class="photo-box card-bg card-border max-min-220 upvj cursor-pointer photo-box-href"  tabindex="0" role="button">
                                <span class="tap-upload-label upload-cover-image-key">${uploadCoverImageKey}</span>
                            </div>
                            <!-- show this div after img added -->
                            <div class="quiz-updated-img max-min-220 card-bg card-border cursor-pointer updated-img bdr-none bg-none" style="display:none">
                                <img src="" id="quiz-img-preview" class="quiz-updated-img card-bg card-border cursor-pointer">
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>

        <div class="footer section-1-footer">
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-9 d-table">
                            <div class="d-table-cell">
                                <a  tabindex="0" role="button" class="theme-color cursor-pointer show-setting" id="hide1">
                                    <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="cc gs gt ha gv"><path class="ui-icon__outline cc" d="M13.82,8.07a.735.735,0,0,1,.5.188l1.438,1.3c.2-.008.4,0,.594.007l1.21-1.25a.724.724,0,0,1,.532-.226,3.117,3.117,0,0,1,.867.226c.469.172,1.3.438,1.328,1.032l.094,1.929a5.5,5.5,0,0,1,.414.422c.594-.007,1.187-.023,1.781-.023a.658.658,0,0,1,.352.117,4.122,4.122,0,0,1,1,2.031.735.735,0,0,1-.188.5l-1.3,1.438c.008.2,0,.4-.007.594l1.25,1.21a.724.724,0,0,1,.226.532,3.117,3.117,0,0,1-.226.867c-.172.461-.438,1.3-1.024,1.328l-1.937.094a5.5,5.5,0,0,1-.422.414c.007.594.023,1.187.023,1.781a.611.611,0,0,1-.117.344A4.1,4.1,0,0,1,18.18,23.93a.735.735,0,0,1-.5-.188l-1.438-1.3c-.2.008-.4,0-.594-.007l-1.21,1.25a.724.724,0,0,1-.532.226,3.117,3.117,0,0,1-.867-.226c-.469-.172-1.3-.438-1.328-1.032l-.094-1.929a5.5,5.5,0,0,1-.414-.422c-.594.007-1.187.023-1.781.023a.611.611,0,0,1-.344-.117A4.1,4.1,0,0,1,8.07,18.18a.735.735,0,0,1,.188-.5l1.3-1.438c-.008-.2,0-.4.007-.594l-1.25-1.21a.724.724,0,0,1-.226-.532,3.117,3.117,0,0,1,.226-.867c.172-.461.446-1.3,1.024-1.328l1.937-.094A5.5,5.5,0,0,1,11.7,11.2c-.007-.594-.023-1.187-.023-1.781a.658.658,0,0,1,.117-.352A4.122,4.122,0,0,1,13.82,8.07ZM12.672,9.617l.023,1.8c.008.312-.859,1.164-1.164,1.18l-1.976.1-.422,1.133,1.289,1.258c.2.2.164.562.164.82a1.781,1.781,0,0,1-.148.844L9.117,18.227l.5,1.1c.6-.008,1.211-.023,1.813-.023.312,0,1.156.859,1.172,1.164l.1,1.976,1.133.422,1.258-1.289c.2-.2.562-.164.82-.164a1.7,1.7,0,0,1,.844.148l1.469,1.321,1.1-.5-.023-1.8c-.008-.312.859-1.164,1.164-1.18l1.976-.1.422-1.133-1.289-1.258c-.2-.2-.164-.562-.164-.82a1.781,1.781,0,0,1,.148-.844l1.321-1.469-.5-1.1c-.6.008-1.211.023-1.813.023-.312,0-1.156-.859-1.172-1.164l-.1-1.976-1.133-.422-1.258,1.289c-.2.2-.562.164-.82.164a1.781,1.781,0,0,1-.844-.148L13.773,9.117ZM16.008,13.5A2.5,2.5,0,1,1,13.5,16,2.531,2.531,0,0,1,16.008,13.5ZM16,14.5a1.5,1.5,0,1,0,1.5,1.461A1.513,1.513,0,0,0,16,14.5Z"></path></svg>    
                                    <span id="due"> ${settingText}</span>
                                </a>
                            </div>
                        </div>
                        <div class="col-3 pl--8 text-right"> 
                            <button type="button" class="btn btn-primary btn-sm pull-right" id="next" tabindex="0" role="button"> <span class="next-key">${nextKey}</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

/**
 * @description Section2 Question Landing page
 */
let section2 = `<div class="section-2 d-none">
                    <div class="card-box quiz-card-section container quiz-preview-sec">
                        <div class="row">
                            <div class="col-12">
                                <div class="quiz-updated-img max-min-220 card-bg bdr-none bg-none card-border cover-img cursor-pointer mb--16 updated-img" style="display:none">
                                    <img src="" id="quiz-title-image" style="display:none" class="quiz-updated-img card-bg card-border">
                                    <input type="file" name="quiz_image" class="d-none" id="cover-image" accept="image/*" src="images/px-img.png" />
                                </div>
                            </div>
                            <div class="col-12">
                                <h4 id="quiz-title-content" class="mb--8"></h4>
                                <p class="text-justify font-12" id="quiz-description-content"></p>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="">
                            <button type="button" class="btn btn-primary btn-sm" id="add-questions"> <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="cc gs gt wh gv">
                                    <path class="ui-icon__outline cc" d="M23.352 16.117c.098.1.148.217.148.352 0 .136-.05.253-.148.351a.48.48 0 0 1-.352.149h-6v6c0 .136-.05.253-.148.351a.48.48 0 0 1-.352.149.477.477 0 0 1-.352-.149.477.477 0 0 1-.148-.351v-6h-6a.477.477 0 0 1-.352-.149.48.48 0 0 1-.148-.351c0-.135.05-.252.148-.352A.481.481 0 0 1 10 15.97h6v-6c0-.135.049-.253.148-.352a.48.48 0 0 1 .352-.148c.135 0 .252.05.352.148.098.1.148.216.148.352v6h6c.135 0 .252.05.352.148z">
                                    </path>
                                    <path class="ui-icon__filled gr" d="M23.5 15.969a1.01 1.01 0 0 1-.613.922.971.971 0 0 1-.387.078H17v5.5a1.01 1.01 0 0 1-.613.922.971.971 0 0 1-.387.078.965.965 0 0 1-.387-.079.983.983 0 0 1-.535-.535.97.97 0 0 1-.078-.386v-5.5H9.5a.965.965 0 0 1-.387-.078.983.983 0 0 1-.535-.535.972.972 0 0 1-.078-.387 1.002 1.002 0 0 1 1-1H15v-5.5a1.002 1.002 0 0 1 1.387-.922c.122.052.228.124.32.215a.986.986 0 0 1 .293.707v5.5h5.5a.989.989 0 0 1 .707.293c.09.091.162.198.215.32a.984.984 0 0 1 .078.387z">
                                    </path>
                                </svg> <span class="add-question-key">${addQuestionKey}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="footer section-2-footer d-none">
                    <div class="footer-padd bt">
                        <div class="container ">
                            <div class="row">
                                <div class="col-9 d-table">
                                    <a class="d-table-cell cursor-pointer" id="back-section2" tabindex="0" role="button">
                                        <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="gt ki gs mr--12">
                                            <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                            </path>
                                            <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                            </path>
                                        </svg> <span class="back-key">${backKey}</span>
                                    </a>
                                </div>
                                <div class="col-3 text-right"> 
                                    <button type="button" class="btn btn-primary btn-sm pull-right" id="submit" tabindex="0" role="button"> <span class="next-key">${nextKey}</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

/** 
 * @description Question Section
 */
let questionsSection = `<div style="display: none;" id="question-section">
        <div class="container question-container" id="question1">
            <div class="card-box card-border card-bg">
                <div class="form-group-question">
                    <div>
                        <span class="question-number font-12 bold input-group-text mb--8 input-tpt pl-0 strong cursor-pointer">Question # 1</span>
                        <span class="input-group-text remove-question remove-option-q input-tpt cursor-pointer" aria-hidden="true" >
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve" tabindex="0" role="button">
                            <rect x="-1.352" y="1.773" fill="none" width="16" height="16"/>
                            <rect fill="none" width="16" height="16"/>
                            <path id="Path_586" d="M11.502,4.001c0.197-0.001,0.392,0.041,0.57,0.125c0.355,0.16,0.64,0.444,0.8,0.8
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
                        </span>
                    </div>
                    <div class="question-preview min-max-132 updated-img" style="display:none">
                        <img src="" class="question-preview-image" style="display:none" />
                    </div>
                    <div class="input-group mb--16 input-group-tpt-q">
                        <div class="input-group-append cursor-pointer">
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve" class="question-image" tabindex="0" role="button">
                                <g>
                                    <path id="Path_589" d="M14.5,2c0.201-0.001,0.4,0.038,0.586,0.117c0.361,0.151,0.648,0.438,0.8,0.8
                                    C15.963,3.102,16.002,3.3,16,3.5v9c0.001,0.199-0.039,0.396-0.117,0.578c-0.077,0.181-0.188,0.346-0.328,0.484
                                    c-0.137,0.136-0.299,0.244-0.477,0.319C14.896,13.961,14.699,14,14.5,14h-13c-0.199,0.001-0.396-0.039-0.578-0.117
                                    c-0.18-0.076-0.344-0.185-0.484-0.32c-0.135-0.141-0.243-0.305-0.319-0.483C0.039,12.896-0.001,12.699,0,12.5v-9
                                    c-0.001-0.199,0.039-0.396,0.117-0.578c0.075-0.178,0.184-0.34,0.32-0.477c0.139-0.139,0.304-0.25,0.484-0.328
                                    C1.104,2.039,1.301,1.999,1.5,2H14.5z M4.875,7.039C4.74,7.035,4.609,7.088,4.516,7.187L1,11.086V12.5
                                    c-0.002,0.133,0.053,0.26,0.148,0.352C1.24,12.947,1.367,13.002,1.5,13h7.711L5.273,7.242C5.229,7.178,5.17,7.127,5.1,7.094
                                    C5.03,7.058,4.953,7.04,4.875,7.039z M1.5,3C1.367,2.999,1.24,3.052,1.148,3.148C1.053,3.24,0.998,3.367,1,3.5v6.094L3.8,6.5
                                    c0.132-0.148,0.295-0.266,0.478-0.344C4.689,5.985,5.155,6.001,5.555,6.2c0.219,0.104,0.406,0.267,0.539,0.469L10.422,13H14.5
                                    c0.274-0.004,0.496-0.226,0.5-0.5v-9c0.002-0.133-0.053-0.26-0.148-0.352C14.76,3.052,14.633,2.999,14.5,3H1.5z M11.5,4.5
                                    c0.266-0.002,0.529,0.051,0.773,0.156c0.482,0.202,0.867,0.586,1.069,1.07C13.448,5.97,13.502,6.234,13.5,6.5
                                    c0.001,0.267-0.055,0.53-0.164,0.773c-0.101,0.24-0.246,0.457-0.43,0.641c-0.184,0.181-0.397,0.327-0.633,0.43
                                    C12.029,8.449,11.766,8.502,11.5,8.5c-0.266,0.001-0.529-0.052-0.773-0.156c-0.475-0.214-0.855-0.595-1.069-1.07
                                    C9.553,7.029,9.499,6.766,9.5,6.5C9.498,6.234,9.551,5.971,9.656,5.727c0.104-0.236,0.248-0.45,0.43-0.633
                                    c0.184-0.183,0.401-0.329,0.641-0.43C10.971,4.555,11.233,4.499,11.5,4.5z M11.5,5.5c-0.135-0.001-0.268,0.025-0.391,0.078
                                    c-0.12,0.052-0.229,0.126-0.32,0.219c-0.09,0.09-0.161,0.196-0.211,0.312C10.525,6.232,10.498,6.366,10.5,6.5
                                    c0,0.134,0.025,0.267,0.078,0.391c0.097,0.242,0.289,0.434,0.531,0.531C11.232,7.474,11.365,7.5,11.5,7.5
                                    c0.135,0.001,0.268-0.025,0.391-0.078c0.117-0.05,0.224-0.121,0.313-0.211c0.093-0.092,0.167-0.2,0.219-0.32
                                    c0.104-0.25,0.104-0.531,0-0.781c-0.097-0.242-0.288-0.434-0.53-0.531C11.768,5.526,11.635,5.499,11.5,5.5z"/>
                                </g>
                            </svg>
                            <input type="file" name="question_image" class="d-none" accept="image/*" id="question-image-1"/>
                        </div>
                        <input type="text" class="form-control in-t pl--32" placeholder="${questionTitleKey}" aria-label="${questionTitleKey}" aria-describedby="basic-addon2" id="question-title" maxlength="5000">
                    </div>
                </div>
                <div class="d-flex-ques">
                    <div class="form-group-opt mb--8" id="options">
                        <div class="choice-outer">
                            <div class="option-div">
                                <div class="row">
                                    <div class="col-12 radio-outer">
                                        <div class="option-preview min-max-132 updated-img" style="display:none">
                                            <img src="" class="option-preview-image" style="display:none" />
                                        </div>
                                        <div class="input-group input-group-tpt mb--8 ">
                                            <div class="input-group-append left cursor-pointer">
                                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve" class="option-image"  tabindex="0" role="button">
                                                    <g>
                                                        <path id="Path_589" d="M14.5,2c0.201-0.001,0.4,0.038,0.586,0.117c0.361,0.151,0.648,0.438,0.8,0.8
                                                            C15.963,3.102,16.002,3.3,16,3.5v9c0.001,0.199-0.039,0.396-0.117,0.578c-0.077,0.181-0.188,0.346-0.328,0.484
                                                            c-0.137,0.136-0.299,0.244-0.477,0.319C14.896,13.961,14.699,14,14.5,14h-13c-0.199,0.001-0.396-0.039-0.578-0.117
                                                            c-0.18-0.076-0.344-0.185-0.484-0.32c-0.135-0.141-0.243-0.305-0.319-0.483C0.039,12.896-0.001,12.699,0,12.5v-9
                                                            c-0.001-0.199,0.039-0.396,0.117-0.578c0.075-0.178,0.184-0.34,0.32-0.477c0.139-0.139,0.304-0.25,0.484-0.328
                                                            C1.104,2.039,1.301,1.999,1.5,2H14.5z M4.875,7.039C4.74,7.035,4.609,7.088,4.516,7.187L1,11.086V12.5
                                                            c-0.002,0.133,0.053,0.26,0.148,0.352C1.24,12.947,1.367,13.002,1.5,13h7.711L5.273,7.242C5.229,7.178,5.17,7.127,5.1,7.094
                                                            C5.03,7.058,4.953,7.04,4.875,7.039z M1.5,3C1.367,2.999,1.24,3.052,1.148,3.148C1.053,3.24,0.998,3.367,1,3.5v6.094L3.8,6.5
                                                            c0.132-0.148,0.295-0.266,0.478-0.344C4.689,5.985,5.155,6.001,5.555,6.2c0.219,0.104,0.406,0.267,0.539,0.469L10.422,13H14.5
                                                            c0.274-0.004,0.496-0.226,0.5-0.5v-9c0.002-0.133-0.053-0.26-0.148-0.352C14.76,3.052,14.633,2.999,14.5,3H1.5z M11.5,4.5
                                                            c0.266-0.002,0.529,0.051,0.773,0.156c0.482,0.202,0.867,0.586,1.069,1.07C13.448,5.97,13.502,6.234,13.5,6.5
                                                            c0.001,0.267-0.055,0.53-0.164,0.773c-0.101,0.24-0.246,0.457-0.43,0.641c-0.184,0.181-0.397,0.327-0.633,0.43
                                                            C12.029,8.449,11.766,8.502,11.5,8.5c-0.266,0.001-0.529-0.052-0.773-0.156c-0.475-0.214-0.855-0.595-1.069-1.07
                                                            C9.553,7.029,9.499,6.766,9.5,6.5C9.498,6.234,9.551,5.971,9.656,5.727c0.104-0.236,0.248-0.45,0.43-0.633
                                                            c0.184-0.183,0.401-0.329,0.641-0.43C10.971,4.555,11.233,4.499,11.5,4.5z M11.5,5.5c-0.135-0.001-0.268,0.025-0.391,0.078
                                                            c-0.12,0.052-0.229,0.126-0.32,0.219c-0.09,0.09-0.161,0.196-0.211,0.312C10.525,6.232,10.498,6.366,10.5,6.5
                                                            c0,0.134,0.025,0.267,0.078,0.391c0.097,0.242,0.289,0.434,0.531,0.531C11.232,7.474,11.365,7.5,11.5,7.5
                                                            c0.135,0.001,0.268-0.025,0.391-0.078c0.117-0.05,0.224-0.121,0.313-0.211c0.093-0.092,0.167-0.2,0.219-0.32
                                                            c0.104-0.25,0.104-0.531,0-0.781c-0.097-0.242-0.288-0.434-0.53-0.531C11.768,5.526,11.635,5.499,11.5,5.5z"/>
                                                    </g>
                                                </svg>
                                                <input type="file" name="option_image" class="d-none" accept="image/*" id="option-image-1"/>
                                            </div>
                                            <input type="text" class="form-control in-t opt-cls pl--32" placeholder="${optionKey}" aria-label="Option 1" aria-describedby="basic-addon2" id="option1" maxlength="1000">
                                            <div class="input-group-append  input-tpt trash-ic cursor-pointer remove-option-href" tabindex="0" role="checkbox">
                                                <span class="remove-option">
                                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">
                                                        <rect x="-1.352" y="1.773" fill="none" width="16" height="16"/>
                                                        <rect fill="none" width="16" height="16"/>
                                                        <path id="Path_586" d="M11.502,4.001c0.197-0.001,0.392,0.041,0.57,0.125c0.355,0.16,0.64,0.444,0.8,0.8
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
                                                </span>
                                            </div>
                                            <div class="input-group-append check-opt check-me-title"  title="${checkMeKey}" tabindex="0" role="checkbox">
                                                <span class="input-group-text input-tpt cursor-pointer">
                                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">
                                                        <rect x="22.695" y="-6" fill="none" width="16" height="16"/>
                                                        <path id="Path_594" d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352
                                                            c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477
                                                            l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005
                                                            c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z"/>
                                                    </svg>
                                                </span>
                                            </div>
                                            <div class="text-right text-success">
                                                <p class="checked-status"> </p>
                                                <input type="checkbox" class="form-check-input d-none" id="check1" value="yes">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="option-div">
                                <div class="row">
                                    <div class="col-12 radio-outer">
                                        <div class="option-preview min-max-132 updated-img" style="display:none">
                                            <img src="" class="option-preview-image" style="display:none" />
                                        </div>
                                        <div class="input-group input-group-tpt mb--8">
                                            <div class="input-group-append left cursor-pointer">
                                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve" class="option-image" tabindex="0" role="button">
                                                    <g>
                                                        <path id="Path_589" d="M14.5,2c0.201-0.001,0.4,0.038,0.586,0.117c0.361,0.151,0.648,0.438,0.8,0.8
                                                            C15.963,3.102,16.002,3.3,16,3.5v9c0.001,0.199-0.039,0.396-0.117,0.578c-0.077,0.181-0.188,0.346-0.328,0.484
                                                            c-0.137,0.136-0.299,0.244-0.477,0.319C14.896,13.961,14.699,14,14.5,14h-13c-0.199,0.001-0.396-0.039-0.578-0.117
                                                            c-0.18-0.076-0.344-0.185-0.484-0.32c-0.135-0.141-0.243-0.305-0.319-0.483C0.039,12.896-0.001,12.699,0,12.5v-9
                                                            c-0.001-0.199,0.039-0.396,0.117-0.578c0.075-0.178,0.184-0.34,0.32-0.477c0.139-0.139,0.304-0.25,0.484-0.328
                                                            C1.104,2.039,1.301,1.999,1.5,2H14.5z M4.875,7.039C4.74,7.035,4.609,7.088,4.516,7.187L1,11.086V12.5
                                                            c-0.002,0.133,0.053,0.26,0.148,0.352C1.24,12.947,1.367,13.002,1.5,13h7.711L5.273,7.242C5.229,7.178,5.17,7.127,5.1,7.094
                                                            C5.03,7.058,4.953,7.04,4.875,7.039z M1.5,3C1.367,2.999,1.24,3.052,1.148,3.148C1.053,3.24,0.998,3.367,1,3.5v6.094L3.8,6.5
                                                            c0.132-0.148,0.295-0.266,0.478-0.344C4.689,5.985,5.155,6.001,5.555,6.2c0.219,0.104,0.406,0.267,0.539,0.469L10.422,13H14.5
                                                            c0.274-0.004,0.496-0.226,0.5-0.5v-9c0.002-0.133-0.053-0.26-0.148-0.352C14.76,3.052,14.633,2.999,14.5,3H1.5z M11.5,4.5
                                                            c0.266-0.002,0.529,0.051,0.773,0.156c0.482,0.202,0.867,0.586,1.069,1.07C13.448,5.97,13.502,6.234,13.5,6.5
                                                            c0.001,0.267-0.055,0.53-0.164,0.773c-0.101,0.24-0.246,0.457-0.43,0.641c-0.184,0.181-0.397,0.327-0.633,0.43
                                                            C12.029,8.449,11.766,8.502,11.5,8.5c-0.266,0.001-0.529-0.052-0.773-0.156c-0.475-0.214-0.855-0.595-1.069-1.07
                                                            C9.553,7.029,9.499,6.766,9.5,6.5C9.498,6.234,9.551,5.971,9.656,5.727c0.104-0.236,0.248-0.45,0.43-0.633
                                                            c0.184-0.183,0.401-0.329,0.641-0.43C10.971,4.555,11.233,4.499,11.5,4.5z M11.5,5.5c-0.135-0.001-0.268,0.025-0.391,0.078
                                                            c-0.12,0.052-0.229,0.126-0.32,0.219c-0.09,0.09-0.161,0.196-0.211,0.312C10.525,6.232,10.498,6.366,10.5,6.5
                                                            c0,0.134,0.025,0.267,0.078,0.391c0.097,0.242,0.289,0.434,0.531,0.531C11.232,7.474,11.365,7.5,11.5,7.5
                                                            c0.135,0.001,0.268-0.025,0.391-0.078c0.117-0.05,0.224-0.121,0.313-0.211c0.093-0.092,0.167-0.2,0.219-0.32
                                                            c0.104-0.25,0.104-0.531,0-0.781c-0.097-0.242-0.288-0.434-0.53-0.531C11.768,5.526,11.635,5.499,11.5,5.5z"/>
                                                    </g>
                                                </svg>
                                                <input type="file" name="option_image" class="d-none" accept="image/*" id="option-image-2"/>
                                            </div>
                                            <input type="text" class="form-control in-t opt-cls pl--32" placeholder="${optionKey}" aria-label="Option 2" aria-describedby="basic-addon2" id="option2" maxlength="1000">
                                            <div class="input-group-append input-tpt trash-ic cursor-pointer" tabindex="0" role="button">
                                                <span class="remove-option">
                                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">
                                                        <rect x="-1.352" y="1.773" fill="none" width="16" height="16"/>
                                                        <rect fill="none" width="16" height="16"/>
                                                        <path id="Path_586" d="M11.502,4.001c0.197-0.001,0.392,0.041,0.57,0.125c0.355,0.16,0.64,0.444,0.8,0.8
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
                                                </span>
                                            </div>
                                            <div class="input-group-append check-opt check-me-title" title="${checkMeKey}"  tabindex="0" role="checkbox">
                                                <span class="input-group-text input-tpt cursor-pointer">
                                                    <svg version="1.1" id="Layer_1"  x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16"  xml:space="preserve">
                                                        <rect x="22.695" y="-6" fill="none" width="16" height="16"/>
                                                        <path id="Path_594"  d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352
                                                            c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477
                                                            l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005
                                                            c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z"/>
                                                    </svg>

                                                </span>
                                            </div>
                                            <div class="text-right text-success">
                                                <p class="checked-status"> </p>
                                                <input type="checkbox" class="form-check-input d-none" value="yes" id="check2"> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="">
                                <button type="button" class="teams-link add-options" tabindex="0" role="button"> 
                                    <svg width="16" height="16" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"  class="cc gs gt tc gv">
                                        <path d="M7.49219 0.5C7.6276 0.5 7.74479 0.549479 7.84375 0.648438C7.94271 0.747396 7.99219 0.864583 7.99219 1V7H13.9922C14.1276 7 14.2448 7.04948 14.3438 7.14844C14.4427 7.2474 14.4922 7.36458 14.4922 7.5C14.4922 7.63542 14.4427 7.7526 14.3438 7.85156C14.2448 7.95052 14.1276 8 13.9922 8H7.99219V14C7.99219 14.1354 7.94271 14.2526 7.84375 14.3516C7.74479 14.4505 7.6276 14.5 7.49219 14.5C7.35677 14.5 7.23958 14.4505 7.14062 14.3516C7.04167 14.2526 6.99219 14.1354 6.99219 14V8H0.992188C0.856771 8 0.739583 7.95052 0.640625 7.85156C0.541667 7.7526 0.492188 7.63542 0.492188 7.5C0.492188 7.36458 0.541667 7.2474 0.640625 7.14844C0.739583 7.04948 0.856771 7 0.992188 7H6.99219V1C6.99219 0.864583 7.04167 0.747396 7.14062 0.648438C7.23958 0.549479 7.35677 0.5 7.49219 0.5Z" fill="#6264A7"/>
                                    </svg>  ${addMoreOptionsKey}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>`;

/**
 * @description Option Section
 */
let optionSection = `<div style="display: none;" id="option-section">
        <div class="option-div">
            <div class="row">
                <div class="col-12 radio-outer">
                    <div class="option-preview min-max-132 updated-img" style="display:none">
                        <img src="" class="option-preview-image" style="display:none" />
                    </div>
                    <div class="input-group input-group-tpt mb--8">
                        <div class="input-group-append left cursor-pointer">
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve" class="option-image"  tabindex="0" role="button">
                                <g>
                                    <path id="Path_589" d="M14.5,2c0.201-0.001,0.4,0.038,0.586,0.117c0.361,0.151,0.648,0.438,0.8,0.8
                                        C15.963,3.102,16.002,3.3,16,3.5v9c0.001,0.199-0.039,0.396-0.117,0.578c-0.077,0.181-0.188,0.346-0.328,0.484
                                        c-0.137,0.136-0.299,0.244-0.477,0.319C14.896,13.961,14.699,14,14.5,14h-13c-0.199,0.001-0.396-0.039-0.578-0.117
                                        c-0.18-0.076-0.344-0.185-0.484-0.32c-0.135-0.141-0.243-0.305-0.319-0.483C0.039,12.896-0.001,12.699,0,12.5v-9
                                        c-0.001-0.199,0.039-0.396,0.117-0.578c0.075-0.178,0.184-0.34,0.32-0.477c0.139-0.139,0.304-0.25,0.484-0.328
                                        C1.104,2.039,1.301,1.999,1.5,2H14.5z M4.875,7.039C4.74,7.035,4.609,7.088,4.516,7.187L1,11.086V12.5
                                        c-0.002,0.133,0.053,0.26,0.148,0.352C1.24,12.947,1.367,13.002,1.5,13h7.711L5.273,7.242C5.229,7.178,5.17,7.127,5.1,7.094
                                        C5.03,7.058,4.953,7.04,4.875,7.039z M1.5,3C1.367,2.999,1.24,3.052,1.148,3.148C1.053,3.24,0.998,3.367,1,3.5v6.094L3.8,6.5
                                        c0.132-0.148,0.295-0.266,0.478-0.344C4.689,5.985,5.155,6.001,5.555,6.2c0.219,0.104,0.406,0.267,0.539,0.469L10.422,13H14.5
                                        c0.274-0.004,0.496-0.226,0.5-0.5v-9c0.002-0.133-0.053-0.26-0.148-0.352C14.76,3.052,14.633,2.999,14.5,3H1.5z M11.5,4.5
                                        c0.266-0.002,0.529,0.051,0.773,0.156c0.482,0.202,0.867,0.586,1.069,1.07C13.448,5.97,13.502,6.234,13.5,6.5
                                        c0.001,0.267-0.055,0.53-0.164,0.773c-0.101,0.24-0.246,0.457-0.43,0.641c-0.184,0.181-0.397,0.327-0.633,0.43
                                        C12.029,8.449,11.766,8.502,11.5,8.5c-0.266,0.001-0.529-0.052-0.773-0.156c-0.475-0.214-0.855-0.595-1.069-1.07
                                        C9.553,7.029,9.499,6.766,9.5,6.5C9.498,6.234,9.551,5.971,9.656,5.727c0.104-0.236,0.248-0.45,0.43-0.633
                                        c0.184-0.183,0.401-0.329,0.641-0.43C10.971,4.555,11.233,4.499,11.5,4.5z M11.5,5.5c-0.135-0.001-0.268,0.025-0.391,0.078
                                        c-0.12,0.052-0.229,0.126-0.32,0.219c-0.09,0.09-0.161,0.196-0.211,0.312C10.525,6.232,10.498,6.366,10.5,6.5
                                        c0,0.134,0.025,0.267,0.078,0.391c0.097,0.242,0.289,0.434,0.531,0.531C11.232,7.474,11.365,7.5,11.5,7.5
                                        c0.135,0.001,0.268-0.025,0.391-0.078c0.117-0.05,0.224-0.121,0.313-0.211c0.093-0.092,0.167-0.2,0.219-0.32
                                        c0.104-0.25,0.104-0.531,0-0.781c-0.097-0.242-0.288-0.434-0.53-0.531C11.768,5.526,11.635,5.499,11.5,5.5z"/>
                                </g>
                            </svg>
                            <input type="file" name="option_image" class="d-none" accept="image/*" id="option-image-1"/>
                        </div>
                        <input type="text" class="form-control in-t opt-cls pl--32" placeholder="${optionKey}" aria-label="Recipient's username" aria-describedby="basic-addon2" id="option-1" maxlength="1000">
                        <div class="input-group-append input-tpt trash-ic cursor-pointer remove-option-href" tabindex="0" role="button">
                            <span class="remove-option">
                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">
                                    <rect x="-1.352" y="1.773" fill="none" width="16" height="16"/>
                                    <rect fill="none" width="16" height="16"/>
                                    <path id="Path_586" d="M11.502,4.001c0.197-0.001,0.392,0.041,0.57,0.125c0.355,0.16,0.64,0.444,0.8,0.8
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
                            </span>
                        </div>
                        <div class="input-group-append check-opt check-me-title" title="${checkMeKey}"  tabindex="0" role="checkbox">
                            <span class="input-group-text input-tpt cursor-pointer">
                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">
                                    <rect x="22.695" y="-6" fill="none" width="16" height="16"/>
                                    <path id="Path_594" d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352
                                        c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477
                                        l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005
                                        c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z"/>
                                </svg>
                            </span>
                        </div>
                        <div class="text-right text-success">
                            <p class="checked-status"> </p>
                            <input type="checkbox" class="form-check-input" value="yes" id="check2" style="display:none"> 
                        </div>        
                    </div>
                </div>
            </div>
        </div>
    </div>`;

/**
 * @description Setting Section
 */
let settingSection = `<div style="display:none" id="setting">
        <div class="container setting-section">
            <div class="row">
                <div class="col-sm-12">
                    <label class="mb--8"><strong class="due-by-key bold">${dueByKey}</strong></label>
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
                <div class="clearfix"></div>
                <div class="d-none">
                    <div class="col-12">
                        <label><strong class="result-visible-key">${resultVisibleToKey}</strong></label>
                    </div>
                    <div class="clearfix"></div>
                    <div class="col-12">
                        <div class="custom-radio-outer">
                            <label class="custom-radio">
                                <input type="radio" name="visible_to" class="visible-to" value="Everyone" >
                                <span class="radio-block"></span> <span class="everyone-key">${everyoneKey}</span>
                            </label>
                        </div>
                        <div class="custom-radio-outer">
                            <label class="custom-radio">
                                <input type="radio" name="visible_to" class="visible-to" value="Only me" checked><span
                                    class="radio-block"></span> <span class="onlyme-key">${onlyMeKey}</span>
                            </label>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="col-12 mt--24">
                    <div class="input-group form-check custom-check-outer">
                        <label class="custom-check form-check-label">
                            <input type="checkbox" name="show_correctAnswer" id="show-correct-answer" value="Yes" checked/>
                            <span class="checkmark"></span>
                            <p class="show-correct-key">${showCorrectAnswerKey}</p>
                            <span class="answer-cannot-change-key sub-text mt--4 d-block">${answerCannotChangeKey}</span>
                        </label>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="footer">
                <div class="footer-padd bt">
                    <div class="container ">
                        <div class="row">
                            <div class="col-9">
                                <div class="d-table">
                                    <a tabindex="0" role="button" class="cursor-pointer" id="back" tabindex="0" role="button">
                                        <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="back-btn">
                                            <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                            </path>
                                            <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                            </path>
                                        </svg> <span class="back-key">${backKey}</span>
                                    </a>
                                </div>
                            </div>
                            <div class="col-3">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

/**
 * @description Variable contains Loader
 */
let loader = `<div class="loader-overlay" style="display:none">
                <div class="loader-outer">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>`;
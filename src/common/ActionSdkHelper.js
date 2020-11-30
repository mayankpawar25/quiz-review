import * as actionSDK from "@microsoft/m365-action-sdk";
export class Localizer {
    /**
     * Method to get Local string and check contains argument to append or not
     * @param id string identifier
     * @param args additional string that want to append on response string to a position
     */
    static async getString(id, ...args) {
        let request = new actionSDK.GetLocalizedStrings.Request();
        let response = (await actionSDK.executeApi(request));
        let strings = response.strings;
        this.jsonObject = strings;
        if (this.jsonObject && this.jsonObject[id]) {
            return this.getStringInternal(this.jsonObject[id], ...args);
        }
        return this.getStringInternal(id, ...args);
    }

    /**
     * Method to get Local string from local file
     * @param id string identifier
     * @param args additional string that want to append on response string to a position
     */
    static getStringInternal(main, ...args) {
        let formatted = main;
        for (let i = 0; i < args.length; i++) {
            let regexp = new RegExp("\\{" + i + "\\}", "gi");
            formatted = formatted.replace(regexp, args[i]);
        }
        return formatted;
    }
}

export class ActionHelper {
    /**
     * Method to hide loader from Canvas
     */
    static async hideLoader() {
        await actionSDK.executeApi(new actionSDK.HideLoadingIndicator.Request());
    }

    /**
     * Method to get context result
     */
    static getContextRequest() {
        return new actionSDK.GetContext.Request();
    }


    /**
     * Method to exceute api
     * @param request object identifier
     */
    static async executeApi(request) {
        return await actionSDK.executeApi(request);
    }

    /**
     * Method to get action request
     * @param actionId string identifier
     */
    static getActionRequest(actionId) {
        return new actionSDK.GetAction.Request(actionId);
    }

    /**
     * Method to get summary data row
     * @param actionId string identifier
     * @param action object identifier
     */
    static getDataRowSummary(actionId, action) {
        return new actionSDK.GetActionDataRowsSummary.Request(actionId, action);
    }

    /**
     * Method to get action data row
     * @param actionId string identifier
     */
    static requestDataRows(actionId) {
        return new actionSDK.GetActionDataRows.Request(actionId);
    }

    /**
     * Method to execute batch request
     * @param args additional array that want to execute to perform in batch
     */
    static batchRequest(args) {
        return new actionSDK.BaseApi.BatchRequest(args);
    }

    /**
     * Method to upload attachment
     * @param fileData blob file data
     * @param fileType string identifier
     */
    static attachmentUpload(fileData, fileType) {
        return actionSDK.AttachmentUtils.creatBlobAttachmentData(fileData, fileType);
    }

    /**
     * Method to request upload attachment
     * @param attachment objet identifier
     */
    static requestAttachmentUpload(attachment) {
        return new actionSDK.UploadAttachment.Request(attachment, function(status) {
            console.log("Status: " + status);
        });
    }

    /**
     * Method to request upload attachment as draft
     * @param attachment objet identifier
     */
    static requestAttachmentUploadDraft(attachment) {
        return new actionSDK.UploadAttachmentDraft.Request(attachment, function (status) {
            console.log("Status: " + status);
        });
    }

    /**
     * Method to get attachment information
     * @param attachmentId string identifier
     */
    static getAttachmentInfo(actionId, attachmentId) {
        return new actionSDK.GetAttachmentInfo.Request(actionId, attachmentId);
    }

    /**
     * Method to get attachment information draft
     * @param attachmentId string identifier
     */
    static getAttachmentInfoDraft(attachmentId) {
        return new actionSDK.GetAttachmentInfoDraft.Request(attachmentId);
    }

    /**
     * Method to get subscribed members counts
     * @param subscription string identifier
     */
    static getSubscriptionMemberCount(subscription) {
        return new actionSDK.GetSubscriptionMemberCount.Request(subscription);
    }

    /**
     * Method to get subscribed members details
     * @param subscription string identifier
     * @param creatorId string identifier
     */
    static getSusbscriptionMembers(subscription, creatorId) {
        return new actionSDK.GetSubscriptionMembers.Request(subscription, creatorId);
    }

    /**
     * Method to get subscribed non participants details
     * @param actionId string identfier
     * @param subscriptionId string identifier
     */
    static getSubscriptionNonParticipants(actionId, subscriptionId) {
        return new actionSDK.GetActionSubscriptionNonParticipants.Request(actionId, subscriptionId);
    }

    /**
     * Method to get set attachment preview in summary view
     * @param request object identfier
     * @param questionname string
     * @param filesAmount Int 
     * @param $imgThumbnail object contaains html object of image thumbnail
     * @param $col3 object contains html object where preview gets append
     * @param type string such as photo, document, video, question
     */
    static setAttachmentPreview(request, questionName, filesAmount, $imgThumbnail, $col3, type) {
        actionSDK.executeApi(request)
            .then(function(response) {
                if (type == 'photo') {
                    $imgThumbnail.append(`<img class="image-sec" id="${questionName}" src="${response.attachmentInfo.downloadUrl}"></img>`);
                    if (filesAmount > 1) {
                        $imgThumbnail.append(`<span class="file-counter"> +${filesAmount - 1} </span>`);
                    }
                    $col3.append($imgThumbnail);
                } else if (type == 'document') {
                    $imgThumbnail.append(`<img class="image-sec" id="${questionName}" src="images/doc.png"></img>`);
                    if (filesAmount > 1) {
                        $imgThumbnail.append(`<span class="file-counter"> +${filesAmount - 1} </span>`);
                    }
                    $col3.append($imgThumbnail);
                } else if (type == 'video') {
                    $imgThumbnail.append(`<div class="embed-responsive embed-responsive-4by3"><video controls="" class="video" id="${questionName}" src="${response.attachmentInfo.downloadUrl}"></video></div>`);
                    $col3.append($imgThumbnail);
                }
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error: " + JSON.stringify(error));
            });
    }

    /**
     * Method to execute the batch request
     * @param batchRequest array object identifier
     */
    static executeBatchApi(batchRequest) {
        return actionSDK.executeBatchApi(batchRequest);
    }

    /**
     * Method to add data row
     * @param data object
     */
    static addDataRow(data) {
        return new actionSDK.AddActionDataRow.Request(data);
    }

    /**
     * Method to close view data
     */
    static closeView() {
        return new actionSDK.CloseView.Request();
    }

    /**
     * Method to get the column type
     * @param type string identifer
     */
    static getColumnType(type) {
        if (type == 'multiselect') {
            return actionSDK.ActionDataColumnValueType.MultiOption;
        } else if (type == 'singleselect') {
            return actionSDK.ActionDataColumnValueType.SingleOption;
        } else if (type == 'largetext') {
            return actionSDK.ActionDataColumnValueType.LargeText
        }
    }

    /**
     * Method to set visibility
     */
    static visibility() {
        return actionSDK.Visibility.All;
    }

    /**
     * Method to create Action
     * @param action object
     */
    static createAction(action) {
        return new actionSDK.CreateAction.Request(action);
    }

    /* 
     * @desc Method to return the input is json object   
     * @param str object contains json values
     */
    static isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

}
Localizer.jsonObject = {};
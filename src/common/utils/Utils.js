// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { UxUtils } from "./UxUtils";
import { Constants } from "./Constants";

export class Utils {
    /**
     * @description Method to generate GUID
     */
    static generateGUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * @description Method to get image dimensions and image div dimensions
     * @param imageURL contains image url
     * @param selector contains image where url placed
     */
    static getClassFromDimension(imgURL, selector) {
        let tmpImg = new Image();
        tmpImg.src = imgURL;
        let imgWidth = 0;
        let imgHeight = 0;
        $(tmpImg).on("load", function () {
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
            let tid = setInterval(() => {
                if ($(selector).hasClass(getClass) == true) {
                    setTimeout(() => {
                        UxUtils.removeImageLoader(selector);
                        clearInterval(tid);
                    }, 500);
                }
            }, 100);
        });
    }

    /**
     * @description Method for calculating date diff from current date in weeks, days, hours, minutes
     * @param start - Date type
     * @param end - Date type
     */
    static calcDateDiff(start, end) {
        let days = (end - start) / (1000 * 60 * 60 * 24);
        let hourText = "hour";
        let minuteText = "minute";
        if (days > 6) {
            let weeks = Math.ceil(days) / 7;
            return Math.floor(weeks) + " week";
        } else {
            if (days < 1) {
                let t1 = start.getTime();
                let t2 = end.getTime();

                let minsDiff = Math.floor((t2 - t1) / 1000 / 60);
                let hourDiff = Math.floor(minsDiff / 60);
                minsDiff = minsDiff % 60;

                if (hourDiff > 1) {
                    hourText = "hours";
                } else {
                    hourText = "hour";
                }
                if (hourDiff > 1) {
                    minuteText = "minutes";
                } else {
                    minuteText = "minute";
                }
                if (hourDiff > 0 && minsDiff > 0) {
                    return hourDiff + " " + hourText + ", " + minsDiff + " " + minuteText;
                } else if (hourDiff > 0 && minsDiff <= 0) {
                    return hourDiff + " " + hourText;
                } else if (hourDiff <= 0 && minsDiff > 0) {
                    return minsDiff + " " + minuteText;
                }
            } else {
                return Math.ceil(days) + " days";
            }
        }
    }

    /**
     * Method to get base64 data of file
     * @param input object html file type input element
     * @param elem object html elem where preview need to show
     */
    static readURL(input, elem) {
        let fileTypes = ["jpg", "jpeg", "png", "gif", "webp", "jfif"];
        let isSuccess = false;
        $(elem).removeClass("heightfit");
        $(elem).removeClass("widthfit");
        $(elem).removeClass("smallfit");
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            let extension = input.files[0].name.split(".").pop().toLowerCase();
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
                        $(elem).attr("src", this.src);
                        if (imgHeight > divHeight) {
                            /* height is greater than width */
                            $(elem).addClass("heightfit");
                        } else if (imgWidth > divWidth) {
                            /* width is greater than height */
                            $(elem).addClass("widthfit");
                        } else {
                            /* small image */
                            $(elem).addClass("smallfit");
                        }
                    };
                };
            } else {
                return false;
            }
            reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
        return true;
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
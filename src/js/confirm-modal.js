function ModalConfirm() {
    var obj = {};
    obj.result = false;
    obj.settings = {
        texts: {
            modalTitle: "Doriti sigur stergerea?",
            modalDescription: "",
            btnYes: "Da",
            btnNo: "Nu"
        },
        redirect: null,
        selectors: {
            modalBox: "#confirmModal",
            btnDelete: null
        }
    };

    obj.setOptions = function(options) {
        obj.settings = $.extend(true, {}, obj.settings, options);
    };

    obj.getOptions = function() {
        return obj.settings;
    };

    obj.modalHtml = null;

    obj.setModalHtml = function() {
        obj.modalHtml = $($(obj.settings.selectors.modalBox).clone().html());
    };

    obj.getModalHtml = function() {
        return obj.modalHtml;
    };

    obj.dataBind = function(key, text) {
        var replace = "{{" + key + "}}";
        var re = new RegExp(replace, "g");
        $(obj.modalHtml).html($(obj.modalHtml).html().replace(re, text));
    };

    obj.modal = function() {
        obj.setModalHtml();

        if (typeof obj.settings.texts === "object") {
            $.each(obj.settings.texts, function(key, text) {
                obj.dataBind(key, text);
            });
        }

        $(obj.modalHtml).modal({
            backdrop: "static",
            keyboard: false,
            show: false
        });
    };

    obj.response = function(callback) {
        $(obj.modalHtml).modal("show");
        $(obj.modalHtml).one("click", "#delete", function() {
            callback(obj.settings.selectors.btnDelete, $(obj.modalHtml));
        });

        $(obj.modalHtml).on("hide.bs.modal", function() {
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            callback = function() {
                return null;
            };
        });
    };

    return obj;
}

$(function() {
    $.fn.modalConfirm = function(options, newCallback) {
        var confirmFunction = new ModalConfirm();
        var callback = {};

        if (options) {
            confirmFunction.setOptions(options);
        }

        confirmFunction.modal();

        if (typeof newCallback === "function") {
            callback = newCallback;
        } else {
            callback = function(btnDelete, $modal) {
                $modal.modal("hide");
                window.location = $(btnDelete).attr("href");
            };
        }

        $(this).click(function() {
            confirmFunction.setOptions({
                selectors: {
                    btnDelete: this
                }
            });
            confirmFunction.response(callback);
            return false;
        });
    };
});
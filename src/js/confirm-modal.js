function ModalConfirm() {
    var obj = {};
    obj.options = {
        texts: {
            modaltitle: "Doriti sigur stergerea?",
            modaldescription: "",
            btnyes: "Da",
            btnno: "Nu"
        },
        selectors: {
            modalbox: "#confirmModal"
        }
    };
    obj.settings = {};

    obj.setOptions = function(options) {
        obj.settings = $.extend(true, {}, obj.options, options);
    };

    obj.getOptions = function() {
        return obj.settings;
    };

    obj.modalHtml = null;

    obj.setModalHtml = function() {
        obj.modalHtml = obj.existModalHtml() ? $($(obj.settings.selectors.modalbox).clone().html()) : null;
    };

    obj.getModalHtml = function() {
        return obj.modalHtml;
    };

    obj.existModalHtml = function() {
        return (document.getElementById(obj.settings.selectors.modalbox.replace('#', '')) !== null && $.isFunction($.fn.modal));
    };

    obj.dataBind = function(key, text) {
        var replace = "{{" + key + "}}";
        var re = new RegExp(replace, "g");
        $(obj.modalHtml).html($(obj.modalHtml).html().replace(re, text));
    };

    obj.response = function(btnElement, callback) {
        if(obj.existModalHtml()) {
            obj.setModalHtml();

            if (typeof obj.settings.texts === "object") {
                $.each(obj.settings.texts, function (key, text) {
                    obj.dataBind(key, text);
                });
            }

            $(obj.modalHtml).modal({
                backdrop: "static",
                keyboard: false,
                show: false
            });

            $(obj.modalHtml).modal("show");
            $(obj.modalHtml).one("click", "[data-action=delete]", function () {
                callback(btnElement, $(obj.modalHtml));
            });

            $(obj.modalHtml).on("hide.bs.modal", function () {
                $("body").removeClass("modal-open");
                $(".modal-backdrop").remove();
                callback = function () {
                    return null;
                };
            });
        }else{
            if(confirm(obj.settings.texts.modaltitle+"\n"+obj.settings.texts.modaldescription)){
                callback(btnElement, $(obj.modalHtml));
            }
        }
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

        if (typeof newCallback === "function") {
            callback = newCallback;
        } else {
            callback = function(btnDelete, $modal) {
                $modal.modal("hide");
                window.location = $(btnDelete).attr("href");
            };
        }

        $(this).click(function() {
            var texts = $(this).data();
            var modalBox = $(this).data('modalbox');
            delete texts.modalbox;

            var options = {};
            if(texts && Object.keys(texts).length > 0){
                options.texts = texts;
            }
            if(modalBox && Object.keys(modalBox).length > 0){
                options.selectors = {modalbox : modalBox};
            }
            confirmFunction.setOptions(options);

            confirmFunction.response(this, callback);
            return false;
        });
    };
});
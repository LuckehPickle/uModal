(function(window){

    "use strict";


    function defineUModal() {

        /**
         * init
         */

        var uModal = {};


        // Wrapper
        var uModalWrapper = document.createElement("div");
        uModalWrapper.className = "uModal-wrapper";
        // uModalWrapper.setAttribute("active", "");


        // Modal Innerjs 
        var uModalInner = document.createElement("div");
        uModalInner.className = "uModal-inner";
        uModalWrapper.appendChild(uModalInner);


        document.body.appendChild(uModalWrapper);


        window.modalQueue = [];

        

        /**
         * Modal
         * @constructor
         * @param {string} title   Modal title.
         * @param {string} body    Modal contents/body.
         * @param {object} type    Type of modal.
         * @param {array}  buttons A list of all modal buttons.
         * @param {object} options Modal options.
         */

        var Modal = function(title, body, type, buttons, options) {
            this.title = title;
            this.body = body;
            this.type = type;
            this.buttons = buttons;
            this.options = options;
            this.guid = guid();

            renderModal(this);
        }



        /**
         * Modal Type
         * @enum {object}
         */

        uModal.type = {

            NORMAL: {
                "class": "uModal-normal",
                "icon":  "",
            },

            
            WARNING: {
                "class": "uModal-warning",
                "icon":  "",
            },


            ERROR: {
                "class": "uModal-error",
                "icon":  "",
            }

        };



        /**
         * Button
         * @constructor
         * @param {string} text   Text to be displayed on the button.
         * @param {object} action Action/function to be completed when clicked.
         */

        var ModalButton = function(text, action) {

            if (typeof action === "undefined")
                action = ModalButton.action.CLOSE;

            this.text   = text;
            this.action = action;

        }



        /**
         * Button Actions
         * @enum {string}
         */

        uModal.buttonAction = {
            CLOSE: "close"
        };



        /**
         * uModal Create
         * @param {string} title Modal title.
         * @param {string} body Modal contents/body.
         * @param {object|null} type Type of modal.
         * @param {array|null} buttons A list of all modal buttons.
         * @param {object|null} options Modal options.
         * @return {object} A new modal object.
         */

        uModal.create = function(title, body, type, buttons, options) {

            var syntax = "uModal.create(title, body[, type, buttons, options])";


            if (typeof title === "undefined") {
                console.error("Modal title was not defined. Use: " + syntax);
                return;
            }


            if (typeof body === "undefined") {
                console.error("Modal body was not defined. Use: " + syntax)
                return;
            }


            if (typeof type == "undefined") {
                type = Modal.type.NORMAL;
            }


            if (typeof buttons === "undefined") {
                buttons = [new ModalButton("ok")];
            }


            if (typeof options === "undefined") {
                options = {
                    closeOnBackgroundClick: true
                };
            }


            return new Modal(title, body, type, buttons, options);


        }



        /**
         * Create Button
         * @param {string|null} text   Text to be displayed on the button.
         * @param {object|null} action Action/function to be completed when clicked.
         * @return {object} A new modal button.
         */

        uModal.createButton = function(text, action) {

            var syntax = "uModal.createButton(text[, action])";

            if (typeof text === "undefined") {
                console.warning("No button text was defined. Use " + syntax);
                text = "";
            }

            return new ModalButton(text, action);

        }



        /**
         * Render Modal
         * @param {object} modal Modal to be rendered.
         */

        var renderModal = function(modal){

            var wrapper = document.querySelector(".uModal-inner");


            // Modal
            var modalElem = document.createElement("div");
            modalElem.className = "uModal " + modal.type.class;
            modalElem.setAttribute("guid", modal.guid);


            // Content
            modalElem.appendChild(
                renderModalContent(modal)
            );


            // Buttons
            var buttonWrapper = document.createElement("div");
            buttonWrapper.className = "uModal-button-wrapper";


            for (var i = 0; i < modal.buttons.length; i++) {

                // Button
                var button = modal.buttons[i];
                buttonWrapper.appendChild(
                    renderButton(button)
                );

            }

            modalElem.appendChild(buttonWrapper);
            modal.element = modalElem;

            wrapper.appendChild(modalElem);

            addToQueue(modal);

        }



        /**
         * Render Modal Content
         * Creates a modal content wrapper to be included inside of a modal.
         * @param {object} modal Modal to extract content from.
         * @return {object} Content to be added to document body.
         */

        var renderModalContent = function(modal) {

            var contentWrapper = document.createElement("div");
            contentWrapper.className = "uModal-content-wrapper";


            // Title
            var title = document.createElement("h1");
            title.className = "uModal-title";
            title.innerText = modal.title;
            contentWrapper.appendChild(title);


            // Body
            var body = document.createElement("p");
            body.className = "uModal-body";
            body.innerText = modal.body;
            contentWrapper.appendChild(body);


            return contentWrapper;

        }



        /**
         * Render Button
         * Creates a button to be included in a modal.
         * @param {object} button Button to be rendered.
         * @return {object} Rendered button.
         */

        var renderButton = function(button) {

            var buttonElem = document.createElement("button");
            buttonElem.className = "uModal-button";
            buttonElem.innerText = button.text;


            if (typeof button.action === "string") {

                var action;


                switch (button.action) {

                    case "close":
                        action = function(event) {
                            var target = event.target;
                            while (!target.hasAttribute("guid")) {
                                if (target.tagName.toLowerCase() == "body") {
                                    return;
                                }
                                target = target.parentElement;
                            }

                            uModal.closeModal(target.getAttribute("guid"));
                        };
                        break;


                    default:
                        console.error("Unknown action '" + b.action + "'.");
                        return;

                }


                buttonElem.addEventListener("click", action);

            } else {

                buttonElem.addEventListener("click", button.action)
            
            }

            return buttonElem;

        }



        /**
         * Add To Queue
         * Queues a modal to be displayed.
         * @param {object} modal Modal to be queued.
         */

        var addToQueue = function(modal) {

            var wrapper = document.querySelector(".uModal-wrapper");

            if (wrapper.hasAttribute("active")) {
                window.modalQueue.push(modal);
            } else {
                modal.element.setAttribute("active", "");
                wrapper.setAttribute("active", "");
            }

        }



        /**
         * Close Modal
         * Either closes a modal or removes it from the modal queue.
         * @param {string|object} modal 
         */

        uModal.closeModal = function(modal) {

            if (typeof modal === "undefined") {
                
                console.error("No modal was defined. Provide either a GUID or a modal object.");
                return;

            } else if (typeof modal === "string") {

                var modals = document.querySelectorAll(".uModal");

                for (var i = 0; i < modals.length; i++) {
                    
                    var m = modals[i];
                    if (m.getAttribute("guid") == modal) {
                        removeModalElement(m);
                        break;
                    }

                }

            } else if (typeof modal === "object") {
                removeModalElement(modal.element);
            }

        }



        /**
         * Remove Modal Element
         */

        var removeModalElement = function(element) {
            console.log(element);
            // Remove element, show next item in queue.
        }



        /**
         * GUID
         * Generates a new random GUID. Note: This may not be truly unique, but the
         * chances of a collission are very low, making it suitable on a local scale.
         * @return {string} A formatted GUID.
         */

        var guid = function() {
            return s4() + s4() + '-' +
                s4() + '-' +
                s4() + '-' +
                s4() + '-' +
                s4() + s4() + s4();
        }



        /**
         * s4
         * A helper function for generating GUIDs.
         * @return {string} A four char base64 string.
         */

        var s4 = function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        
        return uModal;

    }


    if (typeof uModal === "undefined") {

        window.uModal = defineUModal();
    
    } else {
    
        console.log("uModal is already defined.");
    
    }

})(window);
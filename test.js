

var buttons = [
    uModal.createButton("ok", uModal.buttonAction.CLOSE),
    uModal.createButton("test", function(event) {
        console.log("Test button clicked.");
    })
];


var modal = uModal.create(
    "Normal Modal",
    "This is a normal modal with a body.",
    uModal.type.NORMAL,
    buttons
);


console.log(modal);
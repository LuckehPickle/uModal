# uModal
uModal is a powerful modal management tool with zero dependencies.


## Basic Usage

To create the most basic modal possible, simply use:

```javascript
uModal.create("Modal title.", "Modal body.");
```


## Advanced Usage


### Modal Types

uModal provides a number of different modal types.

 * Normal
 * Warning
 * Error

Define a modals type by using the following:

```javascript
uModal.create(title, body, uModal.type.WARNING);
```


### Buttons

uModal gives you complete control over a modal's buttons. Simply create an array of any buttons you wish to add. 

```javascript
var buttons = [
    uModal.createButton("Ok")
];

uModal.create(title, body, uModal.type.NORMAL, buttons);
```

By default, a button will close its parent modal when clicked. uModal allows you to change this by specifying a different action. A [full list of available actions](https://github.com/LuckehPickle/uModal/) can be found here.

```javascript
uModal.createButton("Close", uModal.buttonAction.CLOSE);
```


If you need a little more flexibility, you can also use a function.

```javascript
uModal.createButton("Help", showHelpFunction);

// or

uModal.createButton("Help", function(event) { ... });
```


### Options

There are a number of options available to help customise your modals. Options can be defined using:

```javascript
var options = {
    closeOnBackgroundClick: true
};

uModal.create(title, body, uModal.type.NORMAL, buttons, options);
```


The following options are available for use:

| Option                    | Type    | Description                                            |
| ------------------------- | ------- | ------------------------------------------------------ |
| `closeOnBackgroundClick`  | boolean | Closes the modal if the user clicks on the background. |
| `closeModalOnButtonClick` | boolean | Automatically closes the modal if a button is clicked. |



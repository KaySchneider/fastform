/**
 * jquery fastform plugin
 * version: 0.0.1
 * author:kayoliver82@gmail.com
 * documentation/sourcecode:https://github.com/KaySchneider/fastform
 */
(function( $ ){ 
    
    /**
     * specify all the methods in there
     */
    var methods = {
        getFormDataArray : function (saveVars) {
            methods.checkInput.apply(this, [saveVars]);
            //check for errors in the form wich the user should be fixed at first
            if(methods.checkFormForError.apply(this) === false) {
                return false;
            }

            var iterate = saveVars.inputElements;
            this.returnArray = new Object();
            var that = methods;
            iterate.each( function (item) {
                var pushMe = new Object();
                var id = $(this).attr('id');
                var element = null;
                switch($(this).prop("tagName")) {
                    case 'INPUT':
                        element = that.getInputField(this) ;
                        break;
                    case 'SELECT':
                        element = that.getSelectField(this);
                        break;
                }
                /**
                 * creating an element entry in the returnArray wich 
                 * is now an Object. Extend the attributes of this returnObject
                 * with the attributes from this html node
                 */
                if(element != null) {
                   
                    if(typeof id =="undefined" ) {
                        id = $(this).attr('name');
                    }
                    pushMe[id] = element;
                    $.extend(that.returnArray,pushMe);
                }
            
            });
            return that.returnArray;
        },
        
        returnArray : new Array(),
        
        getInputField : function (inputField) {
            var type = $(inputField).attr('type');
            var stringField;

            switch(type) {
                case 'checkbox':
                    stringField = $(inputField).attr('checked');
                    break;
                case 'radio' :
                    if( $(inputField).attr('checked') == "checked") {
                        stringField = $(inputField).val();
                    } else {
                        stringField = null;
                    }
                    break;
                default:
                    stringField = $(inputField).val();
                    break;
            }
            return stringField;
           
        },
        
        getSelectField : function (inputField) {
            var id = $(inputField).attr('id');
            var stringField = $('#' + id  + ' option:selected').html();
            return stringField;
        },
            
        checkFormForError : function () {
            if($('*.error',this).length == 0) {
                return true;
            } else {
                return false;
            }
        },
        
        checkInput : function (saveVars)  {
            var iterate = saveVars.inputElements;
            var that = methods;
            iterate.each( function (item) {
                var isRequired = $(this).attr('required');
                if(isRequired == 'required') {
                    switch($(this).prop("tagName")) {
                        case 'INPUT':
                            that.checkInputField(this);
                            break;
                    }
                }
            });
           
        },
        checkInputField : function (inputField) {
            var type = $(inputField).attr('type');
            var regResult = true;
            var stringField = $(inputField).val();
            if(type == 'email') {
                regResult = methods.checkMailValue(stringField);
            } 
           
            if(stringField.length == 0 || regResult === false) {
                methods.addError(inputField);
                return false;
            } else {
                methods.removeError(inputField);
                return true;
            }
        },
        checkMailValue : function (value) {
            var regex = /^[\.a-z0-9_\-]+[@][a-z0-9_\-]+([.][a-z0-9_\-]+)+[a-z]{1,4}$/i;
            if( regex.test(value) ) {
                return true;
            } else {
                return false;
            }
             
        },
        removeError : function (inputField) {
            if(   $(inputField).parent().parent().hasClass('error') ) {
                $(inputField).parent().parent().removeClass('error');
            }
            //check for Errors in the Form
            methods.checkFormForError();
        },
        
        addError : function (inputField) {
            if(  ! $(inputField).parent().parent().hasClass('error') ) {
                $(inputField).parent().parent().addClass('error');
            }
    
            methods.checkFormForError();
        }
    };
    
    $.fn.fastform = function () {
        //reset the values!
        methods.returnArray = new Array();
        saveVars =  {
            inputElements : $(':input', this)
        }
        return methods.getFormDataArray.apply(this, [saveVars]);
    };
    
    
})(jQuery);
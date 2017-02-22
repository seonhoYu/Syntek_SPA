var environment;
var screenRollNo = 0;
var transitionSpeed = 1000;
$(function () {

    var contents = [];

    $.getJSON("contents.json", function (data) {
        contents = data;
        generateAllContentsHTML(contents);


        $('section.sectionitem').each(function (idx) {
            var template = $(this).attr('template');
            var list = $('#section' + template);
            var prefix = 'Template/' + template;

            $.get(prefix + "/index.html", function (html) {
                //var updatedData = html.replace(/assets\/+/g, "Template/" + template + "/assets/");
                //list.append(updatedData);
                var theTemplate = Handlebars.compile(html);

                $.getJSON('Template/' + template + "/assets/data/data.json").done(function (data) {
                    var compiledHtml = theTemplate(data);
                    compiledHtml = compiledHtml.replace(/assets\/+/g, "Template/" + template + "/assets/");
                    list.append(compiledHtml);
                })
                .fail(function () {
                    var convertedHtml = html.replace(/assets\/+/g, "Template/" + template + "/assets/")
                    list.append(convertedHtml);
                });
            });
        })
    });

    $.getJSON("environment.json", function (data) {
        environment = data;
        if (environment.screenRoller != undefined && environment.screenRoller.length > 0) {
            transition();
            //$(".content").fadeIn(transitionSpeed);
        }
        else {
            $(".content[id=" + environment.screenId + "]").fadeIn(transitionSpeed);
        }
    });

    function generateAllContentsHTML(data) {
        var list = $('.main-content');

        var theTemplateScript = $("#contents-template").html();

        var theTemplate = Handlebars.compile(theTemplateScript);
        list.append(theTemplate(data));
    }

    function transition() {
        if (screenRollNo >= environment.screenRoller.length) {
            screenRollNo = 0;
        }

        $(".sectionitem").hide();
        $(".sectionitem[pageid=" + environment.screenRoller[screenRollNo].id + "]").show();

        //$(".content").fadeOut(transitionSpeed);
        //$(".content[id=" + environment.screenRoller[screenRollNo].id + "]").fadeIn(transitionSpeed);

        setTimeout(transition, environment.screenRoller[screenRollNo].interval + 1000);
        screenRollNo++;
    }
});
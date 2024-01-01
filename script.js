$(document).ready(function ()
{
    var objs = []; // array of returned objects

    $("#searchBox").trigger("focus");

    $("#searchBox").on("keydown", function (e)
    {
        if (e.which == 13) // if enter pressed
        {
            $.ajax
            ({
                type: "GET",
                url: "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&q=" + $("#searchBox").val(),
                dataType: "json",
                error: function (err) { console.error(err); }

            }).done(res => {

                $("#no_res").remove();// remove earlier search results
                $("table").remove();  //    


                // checks number of results
                if (res.objectIDs == null)
                {
                    $("main").append("<p id='no_res'> No matching results were found</p>");
                    return;
                }
                else if (res.objectIDs.length < 10)
                {
                    for (let i = 0; i < res.objectIDs.length; i++)
                        objs[i] = res.objectIDs[i];
                }
                else
                {
                    for (let i = 0; i < 10; i++)
                        objs[i] = res.objectIDs[i];
                }


                for (let i = 0; i < objs.length; i++)
                {
                    if (i == 0)
                        $("main").append("<table>"); // result table start --------

                    $.ajax
                    ({
                        type: "GET",
                        url: "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + objs[i],
                        dataType: "json",
                        error: function (err) { console.error(err); }

                    }).done(res2 => {

                        objs[i] = res2;

                        $("table").append
                        (
                            "<tr>" +
                                "<td>" + 
                                    "<div>" +
                                        // image check
                                        (objs[i].primaryImage == "" ? 
                                        "<div style='height:150px; width:150px; color:grey;'><i>Image Not Found</i></div>" : // if there is no image put a blank div here
                                        "<img src='" + objs[i].primaryImage + "'></img>"  // if it is put it there
                                        ) +

                                        "<br/>" +

                                        // if string empty put simply "Not Found"
                                        "<p> Author: " + (objs[i].artistDisplayName == "" ? "Not found" : objs[i].artistDisplayName) + "</p>" +
                                        "<p> Title: " + (objs[i].title == "" ? "Not found" : objs[i].title) +
                                        "<p> Country of origin: " + (objs[i].country == "" ? "Not found" : objs[i].country) +
                                        "<p> Date of origin: " + (objs[i].objectDate == "" ? "Not found" : objs[i].objectDate) +
                                        "<p style='font-size:80%; color:grey;'> Gallery number:" + objs[i].GalleryNumber + "</p>" +
                                    "</div>" +
                                "</td>" +
                            "</tr>" +

                            "<br/>" 
                        );

                        if (i == objs.length - 1) // <- this avoid asynchonity
                            $("main").append("</table>"); // result table end ---------
                    });
                }
            });
        }
    });
});
// nuts indentation
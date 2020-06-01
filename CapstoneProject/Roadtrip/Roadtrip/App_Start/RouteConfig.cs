using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Roadtrip
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );


            routes.MapRoute(
                name: "UserComments",
                url: "Comments/Create/{id}",
                defaults: new { controller = "Comments", action = "Create", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "SaveRoute",
                url: "SavedRoutes/SaveRoute",
                defaults: new { controller = "SavedRoutes", action = "SaveRoute" }
            );

            routes.MapRoute(
                name: "DeleteRoute",
                url: "SavedRoutes/DeleteRoute",
                defaults: new { controller = "SavedRoutes", action = "DeleteRoute" }
            );

            routes.MapRoute(
                name: "RequestFollow",
                url: "Profiles/RequestFollow",
                defaults: new { controller = "Profiles", action = "RequestFollow" }
            );

            routes.MapRoute(
                name: "ConfirmFollow",
                url: "Profiles/ConfirmFollow",
                defaults: new { controller = "Profiles", action = "ConfirmFollow" }
            );

            routes.MapRoute(
                name: "DenyFollow",
                url: "Profiles/DenyFollow",
                defaults: new { controller = "Profiles", action = "DenyFollow" }
            );

            routes.MapRoute(
                name: "Unfollow",
                url: "Profiles/Unfollow",
                defaults: new { controller = "Profiles", action = "Unfollow" }
            );

            routes.MapRoute(
                name: "UpdateAboutMe",
                url: "Profiles/UpdateAboutMe",
                defaults: new { controller = "Profiles", action = "UpdateAboutMe" }
            );

            routes.MapRoute(
                name: "TogglePrivacy",
                url: "Profiles/TogglePrivacy",
                defaults: new { controller = "Profiles", action = "TogglePrivacy" }
            );

            routes.MapRoute(
               name: "SaveImageLink",
               url: "Profiles/SaveImageLink",
               defaults: new { controller = "Profiles", action = "SaveImageLink" }
           );


            routes.MapRoute(
                name: "GetEstablishment",
                url: "Routes/GetEstablishment",
                defaults: new { controller = "Routes", action = "GetEstablishment" }
            );

            routes.MapRoute(
                name: "GetDetails",
                url: "Routes/GetDetails/{id}",
                defaults: new { controller = "Routes", action = "GetDetails", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "GetMoreDetails",
                url: "Routes/GetMoreDetails/{id}",
                defaults: new { controller = "Routes", action = "GetMoreDetails", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "LoadComments",
                url: "Routes/LoadComments/{id}",
                defaults: new { controller = "Routes", action = "LoadComments", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "LoadEvents",
                url: "Home/LoadEvents/{id}",
                defaults: new { controller = "Home", action = "LoadEvents", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "LoadCommentsEvents",
                url: "Events/LoadComments/{id}",
                defaults: new { controller = "Events", action = "LoadCommentsEvents", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Routes",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Routes", action = "Create", id = UrlParameter.Optional }
            );
        }
    }
}
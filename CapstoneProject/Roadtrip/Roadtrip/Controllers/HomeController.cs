using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Diagnostics;
using System.IO;
using System.Net;
using Newtonsoft.Json.Linq;
using System.Web.Helpers;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Roadtrip.Models.ViewModels;
using System.Text;
using Roadtrip.Controllers;
using Roadtrip.Models;
using Roadtrip.DAL;

namespace Roadtrip.Controllers
{
    public class HomeController : Controller
    {
        ProfileContext db2 = new ProfileContext();

        [HttpGet]
        public ActionResult Index()
        {
            var userName = User.Identity.Name;
            List<Profile> test = db2.Profiles.Where(Profiles => Profiles.UserName == userName).ToList();

            if(test.Count > 0) { 
                int ChristAlmightyThatTookWayTooLong = test[0].PPID;
                ViewBag.UserID = ChristAlmightyThatTookWayTooLong;
            }

            string path = Server.MapPath("~/Uploads/");
            if (System.IO.File.Exists(path + User.Identity.Name + ".jpeg"))
            {
                
                ViewBag.loggedIn = true;
            }
            else
                ViewBag.loggedIn = false;
            return View();
        }

        public ActionResult Credits()
        {
            return View();
        }

        public JsonResult LoadEvents(int id)
        {
            var events = from a in db2.Attendant
                         join e in db2.Events on a.EventID equals e.EID
                         where a.UserID == id
                         orderby a.Event.Start
                         select new { a.Event.EventName, a.Event.Start };

            Trace.WriteLine(events);

            return Json(events, JsonRequestBehavior.AllowGet);
        }


        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Establishment(string id)
        {
            ViewBag.Message = id;

            return View((object)id);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Roadtrip.Models;
using Microsoft.AspNet.Identity;
using System.Web.Security;

namespace Roadtrip.Controllers
{
    public class EventsController : Controller
    {
        private ProfileContext db2 = new ProfileContext();

        // GET: Events
        public ActionResult Index()
        {
            return View(db2.Events.ToList());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(int? EventID)
        {
            //Gets the user's id
            var userName = User.Identity.Name;
            List<Profile> test = db2.Profiles.Where(Profiles => Profiles.UserName == userName).ToList();
            int ChristAlmightyThatTookWayTooLong = test[0].PPID;

            Attendant attendant = new Attendant();
            attendant.EventID = EventID.Value;
            attendant.UserID = ChristAlmightyThatTookWayTooLong;
            db2.Attendant.Add(attendant); //add user as attendant of event
            db2.SaveChanges();
            return RedirectToAction("Index");
        }

            // GET: Events/Details/5
            public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Event @event = db2.Events.Find(id);
            ViewBag.eid = @event.EID; 
            if (@event == null)
            {
                return HttpNotFound();
            }
            return View(@event);
        }

        public JsonResult LoadCommentsEvents(string id)
        {
            int x = Int32.Parse(id); //Convert from string to int
            var comments = db2.Comments.Where(s => s.EstablishmentID == id).ToList(); //Grabs all comments for an event
            if (comments.Count() == 0)
            {
                var model = new
                {
                    EstablishmentID = id
                };

                return Json(model, JsonRequestBehavior.AllowGet);
            }

            return Json(comments, JsonRequestBehavior.AllowGet);
        }

        //parses out name from string of name, latitude, longitude and creates string of only names of establishments on the route
        public void ParseRoute(Event model)
        {
            System.Text.StringBuilder routeString = new System.Text.StringBuilder();
            int start, end;

            //Split the stored string into an array of locations
            string[] words = model.Route.Split('\n');

            //Foreach location-
            for (int i = 0; i < words.Length - 1; i++)
            {
                start = words[i].IndexOf("[Na]");
                end = words[i].LastIndexOf("[Na]");
                routeString.Append(words[i].Substring(start + 4, end - start - 4));
                if(words.Length - 2 > i)
                {
                    routeString.Append("-");
                }
            }

            model.Route = routeString.ToString();
        }

        // GET: Events/Create
        public ActionResult Create()
        {
            Event model = new Event();
            int id = Convert.ToInt32(Request.QueryString["id"]);
            var test = db2.SavedRoutes.Where(e => e.SRID == id).ToList();
            model.Route = test[0].Route;
            model.Start = DateTime.Now;
            model.Finish = DateTime.Now;
            ParseRoute(model);
            return View(model);
        }

        // POST: Events/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "EID,EventName,Route,Start,Finish")] Event @event)
        {
            if (ModelState.IsValid)
            {
                db2.Events.Add(@event);
                db2.SaveChanges();
                Attendant model = new Attendant();
                var userName = User.Identity.Name;
                List<Profile> test = db2.Profiles.Where(Profiles => Profiles.UserName == userName).ToList();
                int ChristAlmightyThatTookWayTooLong = test[0].PPID;
                model.EventID = @event.EID;
                model.UserID = ChristAlmightyThatTookWayTooLong;
                db2.Attendant.Add(model);
                db2.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(@event);
        }


        // GET: Events/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Event @event = db2.Events.Find(id);
            if (@event == null)
            {
                return HttpNotFound();
            }
            return View(@event);
        }

        // POST: Events/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Event @event = db2.Events.Find(id);
            db2.Events.Remove(@event);
            db2.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db2.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}

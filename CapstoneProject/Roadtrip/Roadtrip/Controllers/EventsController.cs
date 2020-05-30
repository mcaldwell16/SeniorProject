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
            var userName = User.Identity.Name;
            List<Profile> test = db2.Profiles.Where(Profiles => Profiles.UserName == userName).ToList();
            int ChristAlmightyThatTookWayTooLong = test[0].PPID;

            Attendant attendant = new Attendant();
            attendant.EventID = EventID.Value;
            attendant.UserID = ChristAlmightyThatTookWayTooLong;
            db2.Attendant.Add(attendant);
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
            if (@event == null)
            {
                return HttpNotFound();
            }
            return View(@event);
        }

        // GET: Events/Create
        public ActionResult Create()
        {
            Event model = new Event();
            int id = Convert.ToInt32(Request.QueryString["id"]);
            var test = db2.SavedRoutes.Where(e => e.SRID == id).ToList();
            model.Route = test[0].Route;
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

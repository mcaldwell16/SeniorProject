using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Roadtrip.DAL;
using Roadtrip.Models; 

namespace Roadtrip.Controllers
{

    public struct Route
    {
        public int SRID { get; set; }
        public string routeName { get; set; } 
        public string Username { get; set; }
        public DateTime Timestamp { get; set; }
        public List<RLocation> Locations { get; set; }
        public string Tag1 { get; set; }
        public string Tag2 { get; set; }
    }
    public struct MoreInfo
    {
        public string RouteName { get; set; }
        public string UserName { get; set; }
        public int RouteID { get; set; }
        public string tag1 { get; set; }
        public string tag2 { get; set; }
    };

public struct RLocation
    {
        public string Name { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Id { get; set; }
    };
    [Authorize]
    public class SavedRoutesController : Controller
    {
        private SavedRoutesModel db = new SavedRoutesModel();

        [HttpPost]
        public JsonResult SaveRoute(List<RLocation> rl, string actName)
        {
            StringBuilder sb = new StringBuilder();
            SavedRoute savedRoute = new SavedRoute();
            string Rname = Request.QueryString["routeName"];
            string tag1 = Request.QueryString["tag1"];
            string tag2 = Request.QueryString["tag2"]; 
            string myName = actName;


            foreach (RLocation r in rl) 
            {
               
                sb.AppendFormat("[Na]{0}[Na] [La]{1}[La] [Lo]{2}[Lo] [Id]{3}[Id] \n",
                    r.Name, r.Latitude, r.Longitude, r.Id);
            }

            if (!db.SavedRoutes.Any())
            {
               // savedRoute.SRID = 0;
            }

                //savedRoute.SRID = db.SavedRoutes.OrderByDescending(s => s.SRID).FirstOrDefault().SRID;

            if (Request.IsAuthenticated)
                savedRoute.Username = User.Identity.Name;
            else
                savedRoute.Username = "test123@wou.com";
            savedRoute.Timestamp = DateTime.UtcNow;
            savedRoute.Route = sb.ToString();
            savedRoute.RouteName = Rname;
            savedRoute.Tag1 = tag1;
            savedRoute.Tag2 = tag2; 

            db.SavedRoutes.Add(savedRoute);
            
            try
            {
                db.SaveChanges();
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
            {
                Exception raise = dbEx;
                foreach (var validationErrors in dbEx.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        string message = string.Format("{0}:{1}",
                            validationErrors.Entry.Entity.ToString(),
                            validationError.ErrorMessage);
                        // raise a new exception nesting
                        // the current instance as InnerException
                        raise = new InvalidOperationException(message, raise);
                    }
                }
                throw raise;
            }

            return Json(new { result = "Redirect", url = Url.Action("/Details/" + savedRoute.SRID ) });
        }

        // GET: SavedRoutes
       
        public ActionResult Index()
        {
            //List<SavedRoute> sr = db.SavedRoutes.OrderByDescending(s => s.Timestamp).ToList();
            List<MoreInfo> mr = new List<MoreInfo>(); 
          
                List<SavedRoute> sr = db.SavedRoutes
                    .OrderByDescending(s => s.Timestamp)
                    .ToList();


                List<LikedRoute> lr = db.LikedRoute
              .Where(s => s.UserName.Contains(User.Identity.Name))
              .ToList();

            for (int i = 0; i <= lr.Count -1; i++)
            {
                for (int j = 0; j <= sr.Count - 1; j++)
                {
                    if (lr[i].RouteID == sr[j].SRID)
                    {
                        mr.Add(new MoreInfo { RouteName = sr[j].RouteName, UserName = sr[j].Username, RouteID = sr[j].SRID, tag1 = sr[j].Tag1, tag2 = sr[j].Tag2 }); 
                    }
                }
            }

                ViewBag.LikedList = mr;

                return View(LoadRoute(sr));
          
        }
        
        public ActionResult Saved()
        {
            List<SavedRoute> sr = db.SavedRoutes
                .Where(s => s.Username.Contains(User.Identity.Name))
                .OrderByDescending(s => s.Timestamp)
                .ToList();

            return View(LoadRoute(sr));
        }

        public void DeleteRoute()
        {
            int id = Int32.Parse(Request.QueryString["id"]);
            List<SavedRoute> sr = db.SavedRoutes
                .Where(s => s.SRID.Equals(id))
                .ToList();

            foreach (SavedRoute s in sr)
            {
                db.SavedRoutes.Remove(s);
                db.SaveChanges();
            }
        }

        public List<Route> LoadRoute(List<SavedRoute> srs)
        {
            List<Route> rls = new List<Route>();

            foreach(SavedRoute sr in srs)
            {


                rls.Add(ParseRoute(sr.Route, sr.Timestamp, sr.RouteName, sr.SRID, sr.Username, sr.Tag1, sr.Tag2)) ;
               


                //rls.Add(ParseRoute(sr.Route, sr.Timestamp, sr.SRID, sr.Username));


            }
            
            


            return rls;
        }

        public Route ParseRoute(string s, DateTime ts, string routeName, int srid, string uName, string tag1, string tag2)
        {
            Route r = new Route();
            r.Locations = new List<RLocation>();
            RLocation rl;
            int start, end;

            //Split the stored string into an array of locations
            string[] words = s.Split('\n');

            //Foreach location-
            for (int i = 0; i < words.Length - 1; i++)
            {
                //Reset our placeholder
                rl = new RLocation();

                start = words[i].IndexOf("[Na]");
                end = words[i].LastIndexOf("[Na]");
                rl.Name = words[i].Substring(start + 4, end - start - 4);

                start = words[i].IndexOf("[La]");
                end = words[i].LastIndexOf("[La]");
                rl.Latitude = double.Parse(words[i].Substring(start + 4, end - start - 4));

                start = words[i].IndexOf("[Lo]");
                end = words[i].LastIndexOf("[Lo]");
                rl.Longitude = double.Parse(words[i].Substring(start + 4, end - start - 4));

                start = words[i].IndexOf("[Id]");
                end = words[i].LastIndexOf("[Id]");
                rl.Id = words[i].Substring(start + 4, end - start - 4);

                //Repeat for others
                r.Locations.Add(rl);
            }

            r.Timestamp = ts;
            r.routeName = routeName;

            r.SRID = srid;
            //r.userName = uName;
            r.Tag1 = tag1;
            r.Tag2 = tag2; 

           // r.SRID = SRID;
            r.Username = uName;

           
            r.Username = uName; 


            return r;
        }



        // GET: SavedRoutes/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            SavedRoute savedRoute = db.SavedRoutes.Find(id);
            if (savedRoute == null)
            {
                return HttpNotFound();
            }
            return View(savedRoute);
        }

        // GET: SavedRoutes/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: SavedRoutes/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "SRID,Route,Timestamp,Username")] SavedRoute savedRoute)
        {
            if (ModelState.IsValid)
            {
                db.SavedRoutes.Add(savedRoute);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(savedRoute);
        }

        // GET: SavedRoutes/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            SavedRoute savedRoute = db.SavedRoutes.Find(id);
            if (savedRoute == null)
            {
                return HttpNotFound();
            }
            return View(savedRoute);
        }

        // POST: SavedRoutes/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "SRID,Route,Timestamp,Username")] SavedRoute savedRoute)
        {
            if (ModelState.IsValid)
            {
                db.Entry(savedRoute).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(savedRoute);
        }

        // GET: SavedRoutes/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            SavedRoute savedRoute = db.SavedRoutes.Find(id);
            if (savedRoute == null)
            {
                return HttpNotFound();
            }
            return View(savedRoute);
        }

        // POST: SavedRoutes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            SavedRoute savedRoute = db.SavedRoutes.Find(id);
            db.SavedRoutes.Remove(savedRoute);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        public ActionResult Unlike()
        {
            string ID1 = Request.QueryString["ID"];
            int ID = Int32.Parse(ID1);
            /* List<LikedRoute> sr = db.LikedRoute
                .Where(s => s.LRID.Equals(ID))
                .ToList();*/
            List<LikedRoute> sr = db.LikedRoute
           .Where(s => s.UserName.Contains(User.Identity.Name))

           .ToList();

           /* foreach (LikedRoute s in sr)
            {
                db.LikedRoute.Remove(s);
                db.SaveChanges();
            }*/
            for (int i = 0; i < sr.Count; i++)
            {
                if (ID == sr[i].RouteID)
                {
                    db.LikedRoute.Remove(sr[i]);
                    db.SaveChanges(); 
                }
            }
            return Json(true); 
        }
        public ActionResult UnlikeEst()
        {
            string ID = Request.QueryString["ID"];

            List<LikedEstablishments> le = db.LikedEstablishments
                .Where(s => s.UserName.Contains(User.Identity.Name)).ToList();

            for (int i = 0; i < le.Count; i++)
            {
                if (ID == le[i].EstablishmentID)
                {
                    db.LikedEstablishments.Remove(le[i]);
                    db.SaveChanges(); 
                }
            }

            return Json(true); 
        }

        public ActionResult SaveLike()
        {
            string userName = Request.QueryString["userName"];
            string SRID = Request.QueryString["SRID"];
            int realSRID = Int32.Parse(SRID);
            LikedRoute likeRoute = new LikedRoute();
            likeRoute.RouteID = realSRID;
            likeRoute.UserName = User.Identity.Name;

            db.LikedRoute.Add(likeRoute);
            
            db.SaveChanges();

            return Json(true);
        }

        public ActionResult CheckLike()
        {
            string ID1 = Request.QueryString["ID"];
            int ID = Int32.Parse(ID1); 

            List<LikedRoute> lr = db.LikedRoute
              .Where(s => s.UserName.Contains(User.Identity.Name))

              .ToList();

            for (int i = 0; i < lr.Count; i++)
            {
                if (ID == lr[i].RouteID)
                {
                    return Json(false); 
                }
            }
            return Json(true); 
        }
        public ActionResult CheckLikeEstablishment()
        {
            string ID = Request.QueryString["ID"];
            List<LikedEstablishments> le = db.LikedEstablishments.Where(s => s.UserName
            .Contains(User.Identity.Name)).ToList(); 
                
            for (int i = 0; i < le.Count; i++)
            {
                if (ID == le[i].EstablishmentID)
                {
                    return Json(false); 
                }
            }

            return Json(true); 
        }

        public ActionResult SaveLikeEstablishment()
        {
            string ESTID = Request.QueryString["ID"];
           
            string ESTName = Request.QueryString["ID2"];
            LikedEstablishments likedEstablishments = new LikedEstablishments();
            likedEstablishments.EstablishmentID = ESTID;
            likedEstablishments.EstablishmentName = ESTName;
            likedEstablishments.UserName = User.Identity.Name;

            db.LikedEstablishments.Add(likedEstablishments);
            db.SaveChanges(); 
            return Json(true); 
        }
        public ActionResult SearchSaved()
        {

            string ID = Request.QueryString["ID"];
            List<SavedRoute> sr = db.SavedRoutes.Where(s => s.Route.Contains(ID)).ToList();
            return new ContentResult
            {
                // serialize C# object "commits" to JSON using Newtonsoft.Json.JsonConvert
                Content = JsonConvert.SerializeObject(LoadRoute(sr)),
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8
            };
            
        }
        
    }
}

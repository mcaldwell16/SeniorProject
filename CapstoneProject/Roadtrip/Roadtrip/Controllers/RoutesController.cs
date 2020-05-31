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
    [Authorize]
    public class RoutesController : Controller
    {
       // ApplicationDbContext db = new ApplicationDbContext();
        CommentsModel db1 = new CommentsModel();

        ProfileContext db2 = new ProfileContext();


        private SavedRoutesModel db = new SavedRoutesModel();


        // GET: Routes
        [HttpGet]
        public ActionResult Index()
        {
            
            string path = Server.MapPath("~/Uploads/");
            if (System.IO.File.Exists(path + User.Identity.Name + ".jpeg"))
            {
                ViewBag.loggedIn = true;
            }
            else
                ViewBag.loggedIn = false;
            return View();
        }

        public ActionResult HowTo()
        {
            return View();
        }
        /*Function that gathers the list of Liked Establishments for the logged in user from the database*/
        public ActionResult getLikeEstablishments()
        {
            /*Calls to a database instance and gathers the list of liked establishments that have the username
             as the current logged in username*/
            List<LikedEstablishments> le = db.LikedEstablishments
             .Where(s => s.UserName.Contains(User.Identity.Name)).ToList();

            /*Converts the list into a Json object to be sent back to javascript*/
            return new ContentResult
            {
                // serialize C# object "commits" to JSON using Newtonsoft.Json.JsonConvert
                Content = JsonConvert.SerializeObject(le),
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8
            };

        }

        public ActionResult Create()
        {

            string path = Server.MapPath("~/Uploads/");
            if (System.IO.File.Exists(path + User.Identity.Name + ".jpeg"))
            {
                ViewBag.loggedIn = true;
            }
            else
            {
                ViewBag.loggedIn = false;
            }
            /*Sends back the liked establishment list to the profile page*/
            List<LikedEstablishments> le = db.LikedEstablishments
             .Where(s => s.UserName.Contains(User.Identity.Name))
             .ToList();

            ViewBag.LikedList = le;


            return View();
        }

        public JsonResult LoadComments(string id)
        {
            var comments = db1.Comments.Where(s => s.EstablishmentID == id).ToList(); //grabs all comments for one establishment
            Trace.WriteLine(comments);
            if(comments.Count() == 0)
            {
                var model = new
                {
                    EstablishmentID = id
                };
                
                return Json(model, JsonRequestBehavior.AllowGet);
            }

            return Json(comments, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadEvents(int id)
        {
            //Grabs all events a user is attending
            var events = from a in db2.Attendant
                         join e in db2.Events on a.EventID equals e.EID
                         where a.UserID == id
                         select new { a.Event.EventName,  a.Event.Start };

            Trace.WriteLine(events);

            return Json(events, JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetEstablishment()
        {
            string city = Request.QueryString["city"];
            string state = Request.QueryString["state"];
            string term = Request.QueryString["name"];
            string radius = Request.QueryString["numbers"];
            string key = System.Web.Configuration.WebConfigurationManager.AppSettings["YelpKey"];
            string uri = "https://api.yelp.com/v3/businesses/search?location=" + city + "," + state + "&radius=" + radius + "&term=" + term;
            string data = SendRequest(uri, key);

            JObject test = JObject.Parse(data);
            List<string> names = new List<string>();
            List<double> index = new List<double>();
            List<double> ratings = new List<double>();
            List<decimal> longi = new List<decimal>();
            List<decimal> lati = new List<decimal>();
            List<string> BusinessID = new List<string>();
            int count = (int)test["total"];

            if (count > 20)
            {
                count = 20;
            }

            for (int i = 0; i < count; i++)
            {
                index.Add(i);
                ratings.Add((double)test["businesses"][i]["rating"]);
                names.Add(((string)test["businesses"][i]["name"]).ToString());
                lati.Add((decimal)test["businesses"][i]["coordinates"]["latitude"]);
                longi.Add((decimal)test["businesses"][i]["coordinates"]["longitude"]);
                BusinessID.Add((string)test["businesses"][i]["id"]);
            }


            var FinalList = new
            {
                name = names,
                rating = ratings,
                indexs = index,
                latitude = lati,
                longitude = longi,
                id = BusinessID,
                total = count
            };

            return Json(FinalList, JsonRequestBehavior.AllowGet);
        }
        
        //use yelp api get details from yelp
        public JsonResult GetDetails()
        {
            string ID = Request.QueryString["id"];
            Console.WriteLine(ID);
            string key = System.Web.Configuration.WebConfigurationManager.AppSettings["YelpKey"];
            Console.WriteLine(key);
            string uri = "https://api.yelp.com/v3/businesses/" + ID;
            string data = SendRequest(uri, key);

            JObject test = JObject.Parse(data);

            List<string> name = new List<string>();
            List<double> rating = new List<double>();
            List<string> img = new List<string>();
            List<string> phone = new List<string>();
            List<string> address = new List<string>();
            List<string> city = new List<string>();
            List<string> state = new List<string>();
            List<string> zipcode = new List<string>();
            List<string> latitude = new List<string>();
            List<string> longitude = new List<string>(); 
            //List<string> ids = new List<string>();

            name.Add((string)test["name"]);
            rating.Add((double)test["rating"]);
            img.Add((string)test["image_url"]);
            phone.Add((string)test["phone"]);
            address.Add((string)test["location"]["address1"]);
            city.Add((string)test["location"]["city"]);
            state.Add((string)test["location"]["state"]);
            zipcode.Add((string)test["location"]["zip_code"]);
            latitude.Add((string)test["coordinates"]["latitude"]);
            longitude.Add((string)test["coordinates"]["longitude"]); 
            //ids.Add((string)test["id"]);

            var FinalList = new
            {
                id = ID,
                names = name,
                ratings = rating,
                image = img,
                phones = phone,
                addresss = address,
                citys = city,
                states = state,
                zipcodes = zipcode, 
                latitudes = latitude,
                longitudes = longitude
            };
            return Json(FinalList, JsonRequestBehavior.AllowGet);
        }

        //use yelp api get user comments from yelp api
        public JsonResult GetMoreDetails()
        {
            string ID = Request.QueryString["id"];
            Console.WriteLine(ID);
            string key = System.Web.Configuration.WebConfigurationManager.AppSettings["YelpKey"];
            Console.WriteLine(key);
            string uri = "https://api.yelp.com/v3/businesses/" + ID +"/reviews";
           
            string data = SendRequest(uri, key);

            JObject test = JObject.Parse(data);

            List<string> texts = new List<string>();
            List<int> ratings = new List<int>();
            List<string> img = new List<string>();
            List<string> names = new List<string>();

            for (int i = 0; i < 3; i++)
            {
                texts.Add((string)test["reviews"][i]["text"]);
                ratings.Add((int)test["reviews"][i]["rating"]);
                img.Add((string)test["reviews"][i]["user"]["image_url"]);
                names.Add((string)test["reviews"][i]["user"]["name"]);
            }



            var FinalList = new
            {
               
                text = texts,
                rating = ratings,
                image = img,
                name = names
            };
            return Json(FinalList, JsonRequestBehavior.AllowGet);
        }

        private string SendRequest(string uri, string key)

        {

            Debug.WriteLine(uri);

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);

            request.Headers.Add("Authorization", "Bearer " + key);

            request.Accept = "application/json";



            string jsonString = null;



            // TODO: You should handle exceptions here

            using (WebResponse response = request.GetResponse())

            {

                Stream stream = response.GetResponseStream();

                StreamReader reader = new StreamReader(stream);

                jsonString = reader.ReadToEnd();

                reader.Close();

                stream.Close();

            }

            return jsonString;

        }

      

        private string SendRequestToken(string uri, string credentials)
        {
            //Sends web request for API information
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            request.Headers.Add("Authorization", "token " + credentials);
            request.Accept = "application/json";

            string jsonString = null;

            using (WebResponse response = request.GetResponse())
            {
                Stream stream = response.GetResponseStream();
                StreamReader reader = new StreamReader(stream);
                jsonString = reader.ReadToEnd();
                reader.Close();
                stream.Close();
            }
            return jsonString;
        }

        public ActionResult Destinations()
        {
            return View();
        }


        public string parseRoute(string route)
        {
            Route r = new Route();
            string[] words = route.Split('\n');
            int start, end;
            RLocation rl;

            for (int i = 0; i < words.Length - 1; i++)
            {
                rl = new RLocation();

                start = words[i].IndexOf("[Na]");
                end = words[i].LastIndexOf("[Na]");
                rl.Name = words[i].Substring(start + 4, end - start - 4);
                r.Locations.Add(rl);
            }
            string s = r.Locations.ToString();
            return s;
        }

        public ActionResult Events()
        {
            
            var userName = User.Identity.Name;
            List<Profile> test = db2.Profiles.Where(Profiles => Profiles.UserName == userName).ToList();
            int ChristAlmightyThatTookWayTooLong = test[0].PPID;

            Profile profile = db2.Profiles.Find(ChristAlmightyThatTookWayTooLong);

            if (profile == null)
            {
                return HttpNotFound();
            }
            EventsViewModel thisUser = new EventsViewModel(profile); //Grabs events that the logged in user is registered to attend
            return View(thisUser);
        }
    }

}













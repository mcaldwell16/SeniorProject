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

        public ActionResult getLikeEstablishments()
        {
            List<LikedEstablishments> le = db.LikedEstablishments
             .Where(s => s.UserName.Contains(User.Identity.Name)).ToList();

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

            List<LikedEstablishments> le = db.LikedEstablishments
             .Where(s => s.UserName.Contains(User.Identity.Name))
             .ToList();

            ViewBag.LikedList = le;


            return View();
        }

        public JsonResult LoadComments(string id)
        {
            var comments = db1.Comments.Where(s => s.EstablishmentID == id).ToList();
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

        public ActionResult DisplayInfo(string myInfo, string city)
        {
            string request = Request.QueryString["myInfo"];
            string myCity = Request.QueryString["city"];
            string myState = Request.QueryString["state"];
            string myKey = System.Web.Configuration.WebConfigurationManager.AppSettings["OpenCageKey"];
            string yelpKey = System.Web.Configuration.WebConfigurationManager.AppSettings["YelpKey"]; 


            /*Parsing and restructuring the place element*/
            string[] words = myInfo.Split(' ');
            string test = words[0];
            for (int i = 1; i <= words.Length - 1; i++)
            {
                test = test + "+" + words[i];
            }
            /*Parsing and restructuring the City*/

            string urlPlace = "https://api.opencagedata.com/geocode/v1/json?q=" + test + "+" + myCity + "+" + myState + "&key=" + myKey;
            //string urlCity = "https://api.opencagedata.com/geocode/v1/json?q=" + myCity + "&key=3e00b526f7af428a93598818cf2e926d";
            string json = SendRequestToken(urlPlace, myKey);
            //string jsonCity = SendRequest(urlCity, key); 
            JObject mapInfo = JObject.Parse(json);
            // JObject cityInfo = JObject.Parse(jsonCity);

            //[JSON].results.[0].bounds.northeast.lat
            //[JSON].results.[0].bounds.northeast.lng

            /*YELP SECTION*/
            string uri = "https://api.yelp.com/v3/businesses/search?location=97361&limit=20";
            string data = SendRequest(uri, yelpKey);




            //string lat =  [JSON].results.[0].bounds.northeast.lat;
            //string lon =  [JSON].results.[0].bounds.northeast.lng; 
            string lat = (string)mapInfo.SelectToken("results.[0].bounds.northeast.lat");
            string lon = (string)mapInfo.SelectToken("results.[0].bounds.northeast.lng");

            /* string cityLat = (string)cityInfo.SelectToken("results.[0].bounds.northeast.lat");
             string cityLon = (string)cityInfo.SelectToken("results.[0].bounds.northeast.lng");*/

            MapInfoViewModel updateInfo = new MapInfoViewModel()
            {
                Lat = lat,
                Lon = lon,

            };



            return new ContentResult
            {

                Content = JsonConvert.SerializeObject(updateInfo),
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8
            };
        }

        private string SendRequestToken(string uri, string credentials)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            request.Headers.Add("Authorization", "token " + credentials);
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

    }

}













﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Roadtrip.Models;
using Roadtrip.Controllers;
using Roadtrip.DAL;

namespace Roadtrip.Controllers
{
    public class ProfilesController : Controller
    {
        private ProfileContext db = new ProfileContext();

        // GET: Profiles
        public ActionResult Index()
        {
            return View(db.Profiles.ToList());

        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Details(Profile profile)
        {
            ViewBag.AccessOK = CheckPrivacy(profile, User.Identity.Name);
            return View(profile);
        }

        [HttpGet]
        // GET: Profiles/Details/5
        public ActionResult Details(string id)
        {
            if (id == null)
            {
                return Content("oops, user profile not specified");
            }
            Profile profile = db.Profiles.FirstOrDefault(s => s.UserName.Equals(id));

            if (profile.Following != null)
                profile.FollowingList = ParseFList(profile.Following, "[F]");

            if (profile.Follower != null)
                profile.FollowerList = ParseFList(profile.Follower, "[F]");

            if (profile.PendingRequests != null)
                profile.PendingRequestsList = ParseFList(profile.PendingRequests, "[P]");

            if (profile.RequestsPending != null)
                profile.RequestsPendingList = ParseFList(profile.RequestsPending, "[P]");

            profile.RecentActivityList = new List<string>();
            List<SavedRoute> recentRoutes = new List<SavedRoute>();
            foreach (string user in profile.FollowingList)
            {
                recentRoutes.AddRange(db.SavedRoutes.Where(s => s.Username.Contains(user)).ToList());
            }
            recentRoutes.OrderByDescending(s => s.Timestamp);

            foreach(SavedRoute sr in recentRoutes)
            {
                string s = "<a href='/Profiles/Details/" + sr.Username + "'>" + sr.Username + "</a> created a new route titled " + sr.RouteName + "! : " + sr.Timestamp.ToLocalTime() + ".";
                profile.RecentActivityList.Add(s);
            }

            /*
            List<SavedRoute> sr = db.SavedRoutes
                .Where(s => s.Username.Contains(User.Identity.Name))
                .OrderByDescending(s => s.Timestamp)
                .ToList();
                */

            if (profile == null)
            {
                return Content("oops, looks like this users profile page isn't set up yet.");
            }


            ViewBag.AccessOK = CheckPrivacy(profile, User.Identity.Name);


            return Details(profile);
        }

        public bool CheckPrivacy(Profile profile, string username)
        {
            bool flag = false;


            int result = ParseFList(profile.Follower, "[F]").IndexOf(username);

            if (profile.PrivacyFlag == "Public" || result > -1 || username == profile.UserName)
                flag = true;


            return flag;
        }

        public void UpdateAboutMe(string text)
        {
            Profile temp = db.Profiles.FirstOrDefault(s => s.UserName.Equals(User.Identity.Name));
            temp.AboutMe = text;
            db.SaveChanges();
        }

        public ActionResult TogglePrivacy(string id)
        {
            Profile profile = db.Profiles.First(s => s.UserName.Contains(id));

            if (profile.PrivacyFlag == "Public")
                profile.PrivacyFlag = "Private";
            else
                profile.PrivacyFlag = "Public";

            db.SaveChanges();

            return Details(profile);
        }

        public void RequestFollow(string id)
        {
            //Get the profile of the user in question
            Profile profile = db.Profiles.First(s => s.UserName.Contains(id));

            //Check that users' pending followers to see if request is already pending
            int alreadyPending = ParseFList(profile.PendingRequests, "[P]").IndexOf(User.Identity.Name);

            if (alreadyPending == -1)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(profile.PendingRequests);
                sb.AppendFormat("[P]" + User.Identity.Name + "[P]\n");
                profile.PendingRequests = sb.ToString();
                db.SaveChanges();
            }

            //Get the profile of the user in question
            Profile myProfile = db.Profiles.First(s => s.UserName.Contains(User.Identity.Name));

            //Check that users' pending followers to see if request is already pending
            alreadyPending = ParseFList(myProfile.RequestsPending, "[P]").IndexOf(id);

            if (alreadyPending == -1)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(myProfile.RequestsPending);
                sb.AppendFormat("[P]" + id + "[P]\n");
                myProfile.RequestsPending = sb.ToString();
                db.SaveChanges();
            }
        }

        public string RemoveEntry(string input, string entryToRemove, string delimiter)
        {
            int location = input.IndexOf(delimiter + entryToRemove + delimiter);

            return input.Remove(location, entryToRemove.Length + delimiter.Length * 2);
        }

        public ActionResult ConfirmFollow(string id)
        {
            //Find the requesters profile
            Profile profile = db.Profiles.First(s => s.UserName.Contains(id));

            //Check if that user is already following me
            int result = ParseFList(profile.Following, "[F]").IndexOf(User.Identity.Name);

            //If they are not following me...
            if (result == -1)
            {
                //...add myself to their following list and save it
                StringBuilder sb = new StringBuilder();
                sb.Append(profile.Following);
                sb.AppendFormat("[F]" + User.Identity.Name + "[F]\n");
                profile.Following = sb.ToString();
                db.SaveChanges();
            }

            //Get my profile
            Profile profileToFollow = db.Profiles.First(s => s.UserName.Contains(User.Identity.Name));

            //Check if the requester is on my follower list
            result = ParseFList(profileToFollow.Follower, "[F]").IndexOf(id);


            //If they are not on my follower list...
            if (result == -1)
            {
                //...add them to my follower list and save the changes
                StringBuilder sb = new StringBuilder();
                sb.Append(profileToFollow.Follower);
                sb.AppendFormat("[F]" + id + "[F]\n");
                profileToFollow.Follower = sb.ToString();
                db.SaveChanges();
            }

            //Then remove their request from my pending request list and save changes
            profileToFollow.PendingRequests = RemoveEntry(profileToFollow.PendingRequests, id, "[P]");
            profile.RequestsPending = RemoveEntry(profile.RequestsPending, User.Identity.Name, "[P]");
            
            
            db.SaveChanges();

            return Details(profileToFollow);
        }

        public ActionResult DenyFollow(string id)
        {
            //Find the requesters profile
            Profile profile = db.Profiles.First(s => s.UserName.Contains(id));


            //Get my profile
            Profile profileToFollow = db.Profiles.First(s => s.UserName.Contains(User.Identity.Name));

            //Then remove their request from my pending request list and save changes
            profileToFollow.PendingRequests = RemoveEntry(profileToFollow.PendingRequests, id, "[P]");

            profile.RequestsPending = RemoveEntry(profile.RequestsPending, User.Identity.Name, "[P]");
            
            
            db.SaveChanges();

            return Details(profileToFollow);
        }

        public ActionResult Unfollow(string id)
        {
            //Find the requesters profile
            Profile profileToUnfollow = db.Profiles.First(s => s.UserName.Contains(id));

            //Get my profile
            Profile myProfile = db.Profiles.First(s => s.UserName.Contains(User.Identity.Name));

            //Remove me from their follower list
            profileToUnfollow.Follower = RemoveEntry(profileToUnfollow.Follower, User.Identity.Name, "[F]");
            //Remove them from my following list
            myProfile.Following = RemoveEntry(myProfile.Following, id, "[F]");
            db.SaveChanges();

            return Details(myProfile);
        }


        public List<string> ParseFList(string s, string delimiter)
        {
            List<string> strings = new List<string>();
            int start, end;
            //Split the stored string into an array
            string[] words = s.Split('\n');

            //Foreach location-
            for (int i = 0; i < words.Length - 1; i++)
            {
                if (words[i].Contains(delimiter))
                {
                    start = words[i].IndexOf(delimiter);
                    end = words[i].LastIndexOf(delimiter);
                    strings.Add(words[i].Substring(start + 3, end - start - 3));
                }
            }

            return strings;
        }


        // GET: Profiles/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Profiles/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "PPID,UserName,Friends,AboutMe,PrivacyFlag")] Profile profile)
        {
            if (ModelState.IsValid)
            {
                db.Profiles.Add(profile);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(profile);
        }

        // GET: Profiles/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Profile profile = db.Profiles.Find(id);
            if (profile == null)
            {
                return HttpNotFound();
            }
            return View(profile);
        }

        // POST: Profiles/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "PPID,UserName,Friends,AboutMe,PrivacyFlag")] Profile profile)
        {
            if (ModelState.IsValid)
            {
                db.Entry(profile).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(profile);
        }

        // GET: Profiles/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Profile profile = db.Profiles.Find(id);
            if (profile == null)
            {
                return HttpNotFound();
            }
            return View(profile);
        }

        // POST: Profiles/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Profile profile = db.Profiles.Find(id);
            db.Profiles.Remove(profile);
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
    }
}

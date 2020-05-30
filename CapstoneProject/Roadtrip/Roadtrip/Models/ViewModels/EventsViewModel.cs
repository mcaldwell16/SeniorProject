using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Roadtrip.Models.ViewModels
{
    public class EventsViewModel
    {
        public EventsViewModel(Profile user)
        {
            var test = user.Attendants
                .Select(
                e => new
                {
                    test1 = e.Event.EventName,
                    test2 = e.Event.Finish,
                    test3 = e.Event.Start,
                    test4 = e.Event.Route
                }).ToList();

            IEnumerable<string> test1 = test.Select(i => i.test1);
            IEnumerable<DateTime> test3 = test.Select(i => i.test3);
            IEnumerable<DateTime> test2 = test.Select(i => i.test2);
            IEnumerable<string> test4 = test.Select(i => i.test4);
            eventName = test1.ToList();
            startName = test3.ToList();
            finishName = test2.ToList();
            route = test4.ToList();
            size = eventName.Count();
        }

        public List<string> eventName { get; set; }
        public List<DateTime> startName { get; set; }
        public List<DateTime> finishName { get; set; }
        public List<string> route { get; set; }
        public int size { get; set; }
    }
}
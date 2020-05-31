using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace Roadtrip.Models.ViewModels
{
    public class EventsViewModel
    {
        public EventsViewModel(Profile user)
        {
            //grab all event names, start time, end time, and the route that passed in user is attending
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
            start = test3.ToList();
            finish = test2.ToList();
            route = test4.ToList();
            size = eventName.Count();
        }

        [DisplayName("Event Name")]
        public List<string> eventName { get; set; }
        [DisplayName("Start Time")]
        public List<DateTime> start { get; set; }
        [DisplayName("Finish Time")]
        public List<DateTime> finish { get; set; }
        [DisplayName("Event Route")]
        public List<string> route { get; set; }
        public int size { get; set; }
    }
}
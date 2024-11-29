const departments = [
  {
    name: "CSE",
    courses: [
      {
        name: "B.Tech",
        branches: [
          {
            name: "Core",
            years: [
              {
                year: "1st Year",
                semesters: [
                  {
                    sem: "5",
                    timetable: ["test1.xlsx"],
                    subjects: [
                      {
                        code: "CS101",
                        name: "Introduction to Programming",
                        credit: "4",
                      },
                      { code: "CS102", name: "Mathematics I", credit: "3" },
                    ],
                  },
                  {
                    sem: "Semester 2",
                    timetable: ["test2.xlsx"],
                    subjects: [
                      { code: "CS201", name: "Data Structures", credit: "4" },
                      {
                        code: "CS202",
                        name: "Discrete Mathematics",
                        credit: "3",
                      },
                    ],
                  },
                ],
              },
              {
                year: "2nd Year",
                semesters: [
                  {
                    sem: "Semester 3",
                    timetable: ["test3.xlsx"],
                    subjects: [
                      { code: "CS301", name: "Algorithms", credit: "4" },
                      { code: "CS302", name: "Operating Systems", credit: "3" },
                    ],
                  },
                  {
                    sem: "Semester 4",
                    timetable: ["test4.xlsx"],
                    subjects: [
                      {
                        code: "CS401",
                        name: "Database Management Systems",
                        credit: "4",
                      },
                      { code: "CS402", name: "Computer Networks", credit: "3" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "IT",
            years: [
              {
                year: "1st Year",
                semesters: [
                  {
                    sem: "Semester 1",
                    timetable: ["it_test1.xlsx"],
                    subjects: [
                      {
                        code: "IT101",
                        name: "Introduction to IT",
                        credit: "4",
                      },
                      {
                        code: "IT102",
                        name: "Mathematics for IT",
                        credit: "3",
                      },
                    ],
                  },
                  {
                    sem: "Semester 2",
                    timetable: ["it_test2.xlsx"],
                    subjects: [
                      { code: "IT201", name: "Data Structures", credit: "4" },
                      {
                        code: "IT202",
                        name: "Discrete Mathematics",
                        credit: "3",
                      },
                    ],
                  },
                ],
              },
              {
                year: "2nd Year",
                semesters: [
                  {
                    sem: "Semester 3",
                    timetable: ["it_test3.xlsx"],
                    subjects: [
                      { code: "IT301", name: "Web Development", credit: "4" },
                      { code: "IT302", name: "Operating Systems", credit: "3" },
                    ],
                  },
                  {
                    sem: "Semester 4",
                    timetable: ["it_test4.xlsx"],
                    subjects: [
                      {
                        code: "IT401",
                        name: "Database Management Systems",
                        credit: "4",
                      },
                      { code: "IT402", name: "Computer Networks", credit: "3" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  // Add more departments here if needed
];

const generateTT = "testing.xlsx";

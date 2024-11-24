const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Computer Science",
    "Data Structures",
    "Algorithms",
    "Machine Learning",
];

const departments = [
    {
        name: "Computer Science Engineering",
        courses: [
            {
                name: "B.Tech",
                branches: [
                    {
                        name: "CSE",
                        years: [
                            {
                                year: "1st Year",
                                semesters: [
                                    "Semester 1",
                                    "Semester 2"
                                ]
                            },
                            {
                                year: "2nd Year",
                                semesters: [
                                    "Semester 3",
                                    "Semester 4"
                                ]
                            }
                        ],
                        subjects: [
                            { code: "CS101", name: "Introduction to Programming", credit: "4" },
                            { code: "CS102", name: "Mathematics I", credit: "3" },
                        ]
                    },
                    {
                        name: "IT",
                        years: [
                            {
                                year: "1st Year",
                                semesters: [
                                    "Semester 1",
                                    "Semester 2"
                                ]
                            },
                            {
                                year: "2nd Year",
                                semesters: [
                                    "Semester 3",
                                    "Semester 4"
                                ]
                            }
                        ],
                        subjects: [
                            { code: "IT101", name: "Introduction to IT", credit: "4" },
                            { code: "IT102", name: "Mathematics for IT", credit: "3" },
                        ]
                    }
                ]
            }
        ]
    },
    // Add more departments as needed
];
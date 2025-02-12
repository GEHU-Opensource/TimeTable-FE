const departments = [
    {
        name: "Computer Science Engineering",
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
                                        sem: "1",
                                    },
                                    {
                                        sem: "2",
                                    },
                                ],
                            },
                            {
                                year: "2nd Year",
                                semesters: [
                                    {
                                        sem: "3",
                                    },
                                    {
                                        sem: "4",
                                    },
                                ],
                            },
                            {
                                year: "3rd Year",
                                semesters: [
                                    {
                                        sem: "5",
                                    },
                                    {
                                        sem: "6",
                                    },
                                ],
                            },
                            {
                                year: "4th Year",
                                semesters: [
                                    {
                                        sem: "7",
                                    },
                                    {
                                        sem: "8",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: "M.Tech",
                branches: [
                    {
                        name: "Core",
                        years: [
                            {
                                year: "1st Year",
                                semesters: [
                                    {
                                        sem: "1",
                                    },
                                    {
                                        sem: "2",
                                    },
                                ],
                            },
                            {
                                year: "2nd Year",
                                semesters: [
                                    {
                                        sem: "3",
                                    },
                                    {
                                        sem: "4",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "School of Computing",
        courses: [
            {
                name: "BCA",
                branches: [
                    {
                        name: "No Branch",
                        years: [
                            {
                                year: "1st Year",
                                semesters: [
                                    {
                                        sem: "1",
                                    },
                                    {
                                        sem: "2",
                                    },
                                ],
                            },
                            {
                                year: "2nd Year",
                                semesters: [
                                    {
                                        sem: "3",
                                    },
                                    {
                                        sem: "4",
                                    },
                                ],
                            },
                            {
                                year: "3rd Year",
                                semesters: [
                                    {
                                        sem: "5",
                                    },
                                    {
                                        sem: "6",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: "MCA",
                branches: [
                    {
                        name: "No Branch",
                        years: [
                            {
                                year: "1st Year",
                                semesters: [
                                    {
                                        sem: "1",
                                    },
                                    {
                                        sem: "2",
                                    },
                                ],
                            },
                            {
                                year: "2nd Year",
                                semesters: [
                                    {
                                        sem: "3",
                                    },
                                    {
                                        sem: "4",
                                    },
                                ],
                            },
                            {
                                year: "3rd Year",
                                semesters: [
                                    {
                                        sem: "5",
                                    },
                                    {
                                        sem: "6",
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

const generateTT = "../testing.xlsx";
const BE_URL = "http://127.0.0.1:8000";

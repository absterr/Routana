const roadmapTemplate = {
  "meta": {
    "title": "Become a Frontend Developer",
    "userContext": {
      "notes": "Wants to focus on React and modern tooling",
      "experience": "Beginner"
    }
  },

  "phases": [
    {
      "id": "uuid-phase-1",
      "title": "Foundations",
      "description": "Core concepts and essential building blocks.",
      "topics": [
        {
          "id": "uuid-topic-js",
          "title": "JavaScript",
          "type": "core",
          "completed": false,
          "about": "JavaScript is the programming language of the web...",
          "resources": [
            {
              "id": "uuid-res-1",
              "type": "video",
              "title": "JavaScript tutorial for beginners",
              "url": "link-goes-here",
              "category": "free"
            }
          ],
          "options": []
        }
      ]
    },

    {
      "id": "uuid-phase-2",
      "title": "Primary Tools & Concepts",
      "description": "Libraries, frameworks, and major tools.",
      "topics": [
        {
          "id": "uuid-topic-ui",
          "title": "UI Libraries",
          "type": "core",
          "completed": false,
          "about": "A UI library provides reusable components...",
          "resources": [],
          "options": [
            {
              "id": "uuid-sub-react",
              "title": "React",
              "type": "optional",
              "completed": false,
              "about": "React is a UI library for building SPAs...",
              "resources": []
            }
          ]
        }
      ]
    }
  ],

  "checkpoints": [
    {
      "id": "uuid-check-1",
      "phaseId": "uuid-phase-1",
      "for": "Foundations",
      "description": "At this point, you should be able to build modern vanilla JS applications"
    },
    {
      "id": "uuid-check-2",
      "phaseId": "uuid-phase-2",
      "for": "Primary Tools & Concepts",
      "description": "At this point, you should have the expertise of an intermediate level developer."
    }
  ],

  "extras": [
    {
      "id": "uuid-extra-1",
      "title": "Web Performance",
      "completed": false,
      "about": "Measuring and optimizing user experience...",
      "resources": [],
      "options": []
    }
  ],

  "relatedFields": [
    {
      "id": "uuid-rel-1",
      "title": "Backend Development"
    },
    {
      "id": "uuid-rel-1",
      "title": "Full-stack development"
    }
  ]
}

export default roadmapTemplate;

const mockRoadmap = {
  "meta": {
    "title": "DevOps Learning Roadmap",
    "userContext": {
      "experience": "Beginner",
      "notes": "Get familiar with tools like docker and Kubernetes"
    }
  },
  "phases": [
    {
      "id": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
      "title": "Phase 1: Foundations & Prerequisites",
      "description": "This phase covers the essential groundwork needed before diving into DevOps tools. You'll learn about operating systems, networking, and basic scripting, which are fundamental for any DevOps engineer.",
      "topics": [
        {
          "id": "03b7a544-3c22-4a71-8d0d-6b5a331a3d12",
          "title": "Linux Fundamentals & Shell Scripting",
          "type": "core",
          "status": "pending",
          "about": "Understanding the Linux command line and writing shell scripts (like Bash) is non-negotiable for automation and managing servers.",
          "resources": [
            {
              "id": "e4f8c9b1-3e4d-4a7b-8c6d-3e5f2a1b9c8d",
              "type": "course",
              "title": "The Linux Command Line: A Complete Introduction",
              "url": "https://linuxcommand.org/tlcl.php",
              "category": "free"
            },
            {
              "id": "f5a9b8c7-4d3e-4b6c-8a9b-4e6f3a2b1c9d",
              "type": "documentation",
              "title": "Bash Scripting Cheat Sheet",
              "url": "https://devhints.io/bash",
              "category": "free"
            }
          ]
        },
        {
          "id": "12c8b7a6-4e5f-4a6b-9c8d-7b6a5c4d3e2f",
          "title": "Networking Basics",
          "type": "core",
          "status": "pending",
          "about": "Learn the fundamentals of networking, including IP addresses, DNS, HTTP/HTTPS, and ports, to understand how services communicate over the internet.",
          "resources": [
            {
              "id": "2d9c8b7a-5f4e-4b6a-8d7c-6a5b4c3d2e1f",
              "type": "video",
              "title": "Networking for Developers",
              "url": "https://www.youtube.com/watch?v=IPvYjXCsTg8",
              "category": "free"
            }
          ]
        },
        {
          "id": "3e1f2d3c-4b5a-4c6d-7e8f-9a0b1c2d3e4f",
          "title": "Choose a Programming Language",
          "type": "optional",
          "status": "pending",
          "about": "While shell scripting is essential, a high-level programming language is useful for more complex automation tasks and writing tooling. Python and Go are popular choices in the DevOps space.",
          "resources": [],
          "options": [
            {
              "id": "4f2g3h4d-5c6b-4d7e-8f9g-0b1c2d3e4f5a",
              "title": "Python",
              "type": "optional",
              "status": "pending",
              "about": "Excellent for scripting, automation, and a wide range of libraries. Very beginner-friendly.",
              "resources": [
                {
                  "id": "5g3h4i5e-6d7c-4e8f-9g0h-1c2d3e4f5a6b",
                  "type": "course",
                  "title": "Automate the Boring Stuff with Python",
                  "url": "https://automatetheboringstuff.com/",
                  "category": "free"
                }
              ]
            },
            {
              "id": "6h4i5j6f-7e8d-4f9g-0h1i-2d3e4f5a6b7c",
              "title": "Go (Golang)",
              "type": "optional",
              "status": "pending",
              "about": "Statically typed and compiled, Go is great for building high-performance command-line tools and infrastructure services. Many DevOps tools (like Docker and Kubernetes) are written in Go.",
              "resources": [
                {
                  "id": "7i5j6k7g-8f9e-4g0h-1i2j-3e4f5a6b7c8d",
                  "type": "documentation",
                  "title": "A Tour of Go",
                  "url": "https://go.dev/tour/",
                  "category": "free"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "2c8d7e6f-1a0b-4b3c-9d8e-7f6a5b4c3d2e",
      "title": "Phase 2: Source Control & CI/CD",
      "description": "This phase introduces version control with Git, the foundation of collaboration in software development. You will also learn the principles of Continuous Integration and Continuous Delivery (CI/CD) to automate the building, testing, and deployment of applications.",
      "topics": [
        {
          "id": "4a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
          "title": "Git - Version Control",
          "type": "core",
          "status": "pending",
          "about": "Git is the most widely used version control system. Mastering it is essential for managing code changes and collaborating with others.",
          "resources": [
            {
              "id": "5b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e",
              "type": "documentation",
              "title": "Pro Git Book",
              "url": "https://git-scm.com/book/en/v2",
              "category": "free"
            },
            {
              "id": "6c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f",
              "type": "course",
              "title": "GitHub Learning Lab",
              "url": "https://github.com/skills",
              "category": "free"
            }
          ]
        },
        {
          "id": "7d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f8g",
          "title": "CI/CD Concepts",
          "type": "core",
          "status": "pending",
          "about": "Learn the theory behind CI/CD pipelines, including concepts like build automation, automated testing, and deployment strategies.",
          "resources": [
            {
              "id": "8e6f7a8b-9c0d-4e1f-2a3b-4c5d6e7f8g9h",
              "type": "article",
              "title": "What is CI/CD?",
              "url": "https://www.redhat.com/en/topics/devops/what-is-ci-cd",
              "category": "free"
            }
          ],
          "options": [
            {
              "id": "9f7a8b9c-0d1e-4f2a-3b4c-5d6e7f8g9h0i",
              "title": "GitHub Actions",
              "type": "core",
              "status": "pending",
              "about": "A modern, popular, and easy-to-start-with CI/CD tool integrated directly into GitHub.",
              "resources": [
                {
                  "id": "0a8b9c0d-1e2f-4a3b-4c5d-6e7f8g9h0i1j",
                  "type": "documentation",
                  "title": "GitHub Actions Documentation",
                  "url": "https://docs.github.com/en/actions",
                  "category": "free"
                }
              ]
            },
            {
              "id": "1b9c0d1e-2f3a-4b4c-5d6e-7f8g9h0i1j2k",
              "title": "Jenkins",
              "type": "optional",
              "status": "pending",
              "about": "A powerful, open-source automation server that has been a standard in CI/CD for many years. It is highly extensible with thousands of plugins.",
              "resources": [
                {
                  "id": "2c0d1e2f-3a4b-4c5d-6e7f-8g9h0i1j2k3l",
                  "type": "documentation",
                  "title": "Jenkins User Documentation",
                  "url": "https://www.jenkins.io/doc/",
                  "category": "free"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "3d9e8f7a-2b1c-4c4d-ad9f-8g7b6c5d4e3f",
      "title": "Phase 3: Containerization & Orchestration",
      "description": "This is a core phase addressing your goal directly. You will learn how to package applications into containers with Docker and then manage, scale, and deploy them automatically using Kubernetes.",
      "topics": [
        {
          "id": "0a9b8c7d-6e5f-4d3c-bf2a-1b0c9d8e7f6g",
          "title": "Docker",
          "type": "core",
          "status": "pending",
          "about": "Learn to create, manage, and run applications in isolated environments called containers. This includes writing Dockerfiles and using Docker Compose for multi-container applications.",
          "resources": [
            {
              "id": "1b0c9d8e-7f6a-4e4d-cg3b-2c1d0e9f8g7h",
              "type": "documentation",
              "title": "Docker Official Documentation",
              "url": "https://docs.docker.com/",
              "category": "free"
            },
            {
              "id": "2c1d0e9f-8g7b-4f5e-dh4c-3d2e1f0a9h8i",
              "type": "course",
              "title": "Docker for the Absolute Beginner",
              "url": "https://www.udemy.com/course/docker-for-the-absolute-beginner/",
              "category": "paid"
            }
          ]
        },
        {
          "id": "3d2e1f0a-9h8i-4g6f-ei5d-4e3f2g1b0i9j",
          "title": "Kubernetes (K8s)",
          "type": "core",
          "status": "pending",
          "about": "Kubernetes is the industry-standard container orchestrator. Learn its architecture and core concepts like Pods, Deployments, Services, and ConfigMaps to manage containerized applications at scale.",
          "resources": [
            {
              "id": "4e3f2g1b-0i9j-4h7g-fj6e-5f4g3h2c1j0k",
              "type": "documentation",
              "title": "Kubernetes Documentation",
              "url": "https://kubernetes.io/docs/home/",
              "category": "free"
            },
            {
              "id": "5f4g3h2c-1j0k-4i8h-gk7f-6g5h4i3d2k1l",
              "type": "course",
              "title": "Kubernetes for the Absolute Beginners - Hands-on",
              "url": "https://www.udemy.com/course/learn-kubernetes/",
              "category": "paid"
            },
            {
              "id": "6g5h4i3d-2k1l-4j9i-hl8g-7h6i5j4e3l2m",
              "type": "video",
              "title": "Kubernetes Tutorial for Beginners",
              "url": "https://www.youtube.com/watch?v=X48VuDVv0do",
              "category": "free"
            }
          ]
        }
      ]
    },
    {
      "id": "4e0f9a8b-3c2d-4d5e-be0a-9h8c7d6e5f4g",
      "title": "Phase 4: Infrastructure as Code (IaC) & Configuration Management",
      "description": "Learn to manage and provision infrastructure through code instead of manual processes. This phase covers provisioning tools like Terraform and configuration management tools like Ansible.",
      "topics": [
        {
          "id": "7h6i5j4e-3l2m-4k0j-im9h-8i7j6k5f4m3n",
          "title": "Terraform",
          "type": "core",
          "status": "pending",
          "about": "Terraform is the leading tool for building, changing, and versioning infrastructure safely and efficiently. It allows you to define your cloud resources (servers, databases, networks) in human-readable configuration files.",
          "resources": [
            {
              "id": "8i7j6k5f-4m3n-4l1k-jn0i-9j8k7l6g5n4o",
              "type": "documentation",
              "title": "HashiCorp Learn - Terraform",
              "url": "https://developer.hashicorp.com/terraform/tutorials",
              "category": "free"
            }
          ]
        },
        {
          "id": "9j8k7l6g-5n4o-4m2l-ko1j-0k9l8m7h6o5p",
          "title": "Ansible",
          "type": "core",
          "status": "pending",
          "about": "Ansible is a simple but powerful tool for automating application deployment, configuration management, and orchestration. It is agentless, meaning it communicates over standard SSH without requiring any software to be installed on the managed nodes.",
          "resources": [
            {
              "id": "0k9l8m7h-6o5p-4n3m-lp2k-1l0m9n8i7p6q",
              "type": "documentation",
              "title": "Ansible Documentation",
              "url": "https://docs.ansible.com/",
              "category": "free"
            }
          ]
        }
      ]
    },
    {
      "id": "5f1a0b9c-4d3e-4e6f-cf1b-0i9d8e7f6g5h",
      "title": "Phase 5: Monitoring, Logging & Observability",
      "description": "Once systems are deployed, they must be monitored. This phase covers the tools and concepts for collecting metrics, logs, and traces to ensure your applications are healthy and performant.",
      "topics": [
        {
          "id": "1l0m9n8i-7p6q-4o4n-mq3l-2m1n0o9j8q7r",
          "title": "Monitoring with Prometheus & Grafana",
          "type": "core",
          "status": "pending",
          "about": "Prometheus is a powerful time-series database for collecting metrics. Grafana is a visualization tool that connects to Prometheus (and other data sources) to create insightful dashboards.",
          "resources": [
            {
              "id": "2m1n0o9j-8q7r-4p5o-nr4m-3n2o1p0k9r8s",
              "type": "documentation",
              "title": "Prometheus Documentation",
              "url": "https://prometheus.io/docs/introduction/overview/",
              "category": "free"
            },
            {
              "id": "3n2o1p0k-9r8s-4q6p-os5n-4o3p2q1l0s9t",
              "type": "documentation",
              "title": "Grafana Documentation",
              "url": "https://grafana.com/docs/grafana/latest/",
              "category": "free"
            }
          ]
        },
        {
          "id": "4o3p2q1l-0s9t-4r7q-pt6o-5p4q3r2m1t0u",
          "title": "Log Management",
          "type": "optional",
          "status": "pending",
          "about": "Learn how to centralize and analyze logs from all your services to effectively troubleshoot issues.",
          "resources": [],
          "options": [
            {
              "id": "5p4q3r2m-1t0u-4s8r-qu7p-6q5r4s3n2u1v",
              "title": "ELK Stack",
              "type": "optional",
              "status": "pending",
              "about": "The ELK Stack (Elasticsearch, Logstash, Kibana) is a comprehensive and powerful solution for log management and analysis.",
              "resources": [
                {
                  "id": "6q5r4s3n-2u1v-4t9s-rv8q-7r6s5t4o3v2w",
                  "type": "article",
                  "title": "What is the ELK Stack?",
                  "url": "https://www.elastic.co/what-is/elk-stack",
                  "category": "free"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "checkpoints": [
    {
      "id": "6a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
      "phaseId": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
      "for": "Phase 1: Foundations & Prerequisites",
      "description": "Should be comfortable with the Linux command line, write basic shell scripts, and understand fundamental networking concepts like DNS and HTTP."
    },
    {
      "id": "7b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e",
      "phaseId": "2c8d7e6f-1a0b-4b3c-9d8e-7f6a5b4c3d2e",
      "for": "Phase 2: Source Control & CI/CD",
      "description": "Able to manage code repositories using Git (branching, merging, pull requests) and build a simple CI/CD pipeline to automatically test and build a project."
    },
    {
      "id": "8c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f",
      "phaseId": "3d9e8f7a-2b1c-4c4d-ad9f-8g7b6c5d4e3f",
      "for": "Phase 3: Containerization & Orchestration",
      "description": "Successfully containerize a web application using Docker, and deploy and manage it on a local Kubernetes cluster (like minikube or k3d)."
    },
    {
      "id": "9d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f8g",
      "phaseId": "4e0f9a8b-3c2d-4d5e-be0a-9h8c7d6e5f4g",
      "for": "Phase 4: Infrastructure as Code (IaC) & Configuration Management",
      "description": "Write a Terraform configuration to provision a virtual machine in a cloud provider and use an Ansible playbook to install and configure a web server on it."
    },
    {
      "id": "0e6f7a8b-9c0d-4e1f-2a3b-4c5d6e7f8g9h",
      "phaseId": "5f1a0b9c-4d3e-4e6f-cf1b-0i9d8e7f6g5h",
      "for": "Phase 5: Monitoring, Logging & Observability",
      "description": "Set up a basic monitoring dashboard in Grafana using Prometheus as a data source to visualize metrics from a running application."
    }
  ],
  "extras": [
    {
      "id": "f1a2b3c4-d5e6-4a7b-8c9d-0e1f2a3b4c5d",
      "title": "Cloud Providers",
      "status": "pending",
      "about": "While you can learn DevOps tools locally, real-world applications run in the cloud. Gaining proficiency with at least one major cloud provider is crucial.",
      "resources": [],
      "options": [
        {
          "id": "a2b3c4d5-e6f7-4b8c-9d0e-1f2a3b4c5d6e",
          "title": "Amazon Web Services (AWS)",
          "type": "optional",
          "status": "pending",
          "about": "The market leader with the most extensive set of services.",
          "resources": [
            {
              "id": "b3c4d5e6-f7a8-4c9d-0e1f-2a3b4c5d6e7f",
              "type": "course",
              "title": "AWS Free Tier",
              "url": "https://aws.amazon.com/free/",
              "category": "free"
            }
          ]
        },
        {
          "id": "c4d5e6f7-a8b9-4d0e-1f2a-3b4c5d6e7f8g",
          "title": "Google Cloud Platform (GCP)",
          "type": "optional",
          "status": "pending",
          "about": "Known for its strength in networking, data analytics, and Kubernetes (GKE).",
          "resources": [
            {
              "id": "d5e6f7a8-b9c0-4e1f-2a3b-4c5d6e7f8g9h",
              "type": "course",
              "title": "Google Cloud Free Tier",
              "url": "https://cloud.google.com/free",
              "category": "free"
            }
          ]
        },
        {
          "id": "e6f7a8b9-c0d1-4f2a-3b4c-5d6e7f8g9h0i",
          "title": "Microsoft Azure",
          "type": "optional",
          "status": "pending",
          "about": "Strong in the enterprise space with excellent integration with Microsoft products.",
          "resources": [
            {
              "id": "f7a8b9c0-d1e2-4a3b-4c5d-6e7f8g9h0i1j",
              "type": "course",
              "title": "Azure Free Account",
              "url": "https://azure.microsoft.com/en-us/free/",
              "category": "free"
            }
          ]
        }
      ]
    },
    {
      "id": "g8b9c0d1-e2f3-4b4c-5d6e-7f8g9h0i1j2k",
      "title": "Security (DevSecOps)",
      "status": "pending",
      "about": "DevSecOps is the practice of integrating security practices into the DevOps lifecycle. This involves automating security checks in the CI/CD pipeline, scanning code for vulnerabilities, and securing infrastructure.",
      "resources": [
        {
          "id": "h9c0d1e2-f3a4-4c5d-6e7f-8g9h0i1j2k3l",
          "type": "article",
          "title": "What is DevSecOps?",
          "url": "https://www.redhat.com/en/topics/devops/what-is-devsecops",
          "category": "free"
        }
      ],
      "options": []
    }
  ],
  "relatedFields": [
    {
      "id": "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6",
      "title": "Site Reliability Engineering (SRE)"
    },
    {
      "id": "b2c3d4e5-f6a7-b8c9-d0e1-f2a3b4c5d6e7",
      "title": "Cloud Engineering"
    },
    {
      "id": "c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8",
      "title": "Platform Engineering"
    },
    {
      "id": "d4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8g9",
      "title": "Software Development"
    }
  ]
};

export default mockRoadmap;

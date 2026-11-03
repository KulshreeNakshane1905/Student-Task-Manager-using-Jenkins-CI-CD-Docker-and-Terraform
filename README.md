# Student Task Manager

A Node.js and Express application for demonstrating Jenkins CI/CD, Docker containerization, and Terraform Infrastructure as Code on AWS.

## Features
- Add tasks with title and optional description.
- List and filter tasks by status.
- Change status: Pending, In Progress, Completed.
- Delete tasks.
- Dashboard statistics.
- REST API and health endpoint.
- JSON-file persistence in the data directory.

## Stack
Node.js 22, Express, HTML, CSS, JavaScript, Docker, Jenkins Pipeline, Terraform, AWS S3.

## Run locally
Requirements: Node.js 20 or later.

```bash
npm install
npm test
npm start
```

Open http://localhost:3000.

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task status |
| DELETE | `/api/tasks/:id` | Delete task |

Example:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete CI/CD assignment","description":"Build the pipeline"}'
```

## Docker
```bash
docker build -t student-task-manager:latest .
docker run -d --name student-task-manager -p 3000:3000 \
  -v student-task-data:/app/data student-task-manager:latest
```

## Jenkins CI/CD
The root `Jenkinsfile` defines Checkout, Install Dependencies, Test, Build Docker Image, Deploy, and Smoke Test stages.

The Jenkins agent requires Git, Node.js 22/npm, Docker CLI with Docker daemon access, and curl. Configure a Pipeline job using **Pipeline script from SCM**, Git, your repository URL, branch `*/main`, and script path `Jenkinsfile`.

The pipeline deploys the container on the Jenkins agent host at port 3000. Ensure that port is available and the Jenkins agent is authorized to use Docker. Restrict Jenkins web access to trusted IP addresses.

## Terraform on AWS
The `terraform/` directory creates a uniquely named S3 bucket with versioning enabled and tags.

Prerequisites: Terraform installed and AWS credentials configured securely, preferably through an IAM role attached to the EC2 instance. Grant only required S3 permissions. Never put AWS keys in Terraform files or GitHub.

```bash
cd terraform
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform output
```

Review the plan before confirming `terraform apply`. When finished, review and run `terraform destroy`. Check for bucket objects before cleanup.

## Notes
- Task data is stored in a JSON file. Mount `/app/data` as a Docker volume to preserve data when replacing the container.
- This is an educational single-instance project, not a production multi-user system.
- Terraform state files and real `.tfvars` files are excluded from Git.
- AWS resources may incur charges; remove demonstration resources when finished.

## Author
Kulshree Nakshane

## Assignment
Jenkins CI/CD + Terraform Mini Project

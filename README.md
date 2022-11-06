# Blogging API

An api for blogs

## Requirements

1. Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs.
    - The endpoint should be paginated
    - It should be filterable by state
13. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
14. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated,
    - default it to 20 blogs per page.
    - It should also be searchable by author, title and tags.
    - It should also be orderable by read_count, reading_time and timestamp
15. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
    16.Come up with any algorithm for calculating the reading_time of the blog.
16. Write tests for all endpoints

---

## Setup

- Install NodeJS, mongodb
- clone this repo
- update env with example.env
- run `npm install`
- run `npm run dev`

---

## Base URL

## <a href='https://busy-blue-snail-boot.cyclic.app/'>https://busy-blue-snail-boot.cyclic.app/</a>

## Models

### User

| field      | data_type | constraints               |
| ---------- | --------- | ------------------------- |
| id         | string    | required                  |
| email      | string    | required,unique,lowercase |
| password   | string    | required,minLength(6)     |
| first_name | string    | required,minLength(2)     |
| last_name  | string    | required,minLength(2)     |

### Order

| field        | data_type | constraints                                         |
| ------------ | --------- | --------------------------------------------------- |
| title        | string    | required,unique                                     |
| description  | string    | optional                                            |
| author       | User(ref) | required                                            |
| state        | number    | required, default:draft, enum:['draft','published'] |
| tags         | [string]  | optional                                            |
| reading_time | number    | required                                            |
| body         | string    | required                                            |
| timestamp    | Date      | required,default:Date.now()                         |

---

## APIS

---

### Authentication (/auth)

1. #### Sign up user

- Route: /auth/signup
- Method: POST
- Body:

```
{
    "email":"postman@gmail.com",
    "password":"qwertyu1&11",
    "first_name":"Post",
    "last_name":"Man"
}
```

- Responses

Success

```
{
    "message": "Signup successful",
    "user": {
        "email": "postman@gmail.com",
        "first_name": "Post",
        "last_name": "Man",
        "_id": "63670c94a3b390f4bc554884",
        "__v": 0
    }
}
```

2. Login user

- Route: /auth/login
- Method: POST
- Body:

```
{
    "email":"postman@gmail.com",
    "password":"qwertyu1&11",
}
```

- Responses

Success

```
{
    "token": "tokenValueComesHere"
}
```

---

### Blogs (/blogs)

1. #### Get All Blogs (published)

- Route: /blogs
- Method: GET
- Query params:
  - page (default:1)
  - limit (default:20)
  - tags (comma separated eg horror,sci-fi)
  - title
  - sortBy (read_count|reading_time|timestamp)
  - order (asc | desc, default:asc)
  - author

Responses

Success

```
{
   {
    "count": 2,
    "blogs": [
        {
            "_id": "6364573b8a280bc10e3ddf11",
            "title": "The man in the mirror and night",
            "description": "doing this all night hightway",
            "author": {
                "_id": "63631e73495b2fd44f76c5f7",
                "email": "ccyamoah@gmail.com",
                "first_name": "Cyril",
                "last_name": "Yamoah",
                "__v": 0
            },
            "state": "published",
            "read_count": 0,
            "reading_time": 0,
            "tags": [],
            "body": " Omnis aspernatur voluptate adipisci cum nostrum deleniti tenetur vero",
            "createdAt": "2022-11-04T00:05:15.896Z",
            "updatedAt": "2022-11-04T00:05:15.896Z",
            "__v": 0
        },
        {
            "_id": "6365c2a0574eb7f51de0d858",
            "title": "I wake up screaming",
            "description": "Midnight",
            "author": {
                "_id": "6365c0066ffdcacbe30975bd",
                "email": "ccyamoah@gmail4.com",
                "first_name": "Rosa",
                "last_name": "Hehe",
                "__v": 0
            },
            "state": "published",
            "read_count": 0,
            "reading_time": 0,
            "tags": [],
            "body": "It's me. I am the problem everybody agrees. sometimes I feel like everybody is a sexy baby. Pierced through the heart. I wake up screamig from dreaming. I aam the problem",
            "createdAt": "2022-11-05T01:55:44.869Z",
            "updatedAt": "2022-11-05T01:55:44.869Z",
            "__v": 0
        }
    ],
    "total_pages": 1
}
}
```

---

2. #### Get Blog by Id

- Route: /blogs/:id
- Method: GET

Responses

Success

```
{
            "_id": "6364573b8a280bc10e3ddf11",
            "title": "The man in the mirror and night",
            "description": "doing this all night hightway",
            "author": {
                "_id": "63631e73495b2fd44f76c5f7",
                "email": "ccyamoah@gmail.com",
                "first_name": "Cyril",
                "last_name": "Yamoah",
                "__v": 0
            },
            "state": "published",
            "read_count": 0,
            "reading_time": 0,
            "tags": [],
            "body": " Omnis aspernatur voluptate adipisci cum nostrum deleniti tenetur vero",
            "createdAt": "2022-11-04T00:05:15.896Z",
            "updatedAt": "2022-11-04T00:05:15.896Z",
            "__v": 0
        }
```

---

3. #### Create new blog

- Route /blogs
- Method: POST
- Header:
  - Authorization: JWT {token}
- Body:

```
{
    "description":"lorem 5",
    "title":"end of the day",
    "body":"lla. Dolores porro, est asperiores ad neque nisi, quos libero minima rem dolorum earum unde possimus. Iusto quisquam enim assumenda, sequi saepe ab culpa quos natus porro commodi qui optio, laudantium architecto unde necessitatibus similique cupiditate blanditiis sed illum ea hic? Cum nam expedita, nemo pariatur aliquam temporibus nobis at quidem Officiis, maxime incidunt nulla totam magni autem quaerat repellendus sit rerum nemo ab ipsa obcaecati cumque dolorum natus consequuntur, porro qui ipsum quas aliquid excepturi iure?",
    "tags":["PUNCH"]
}
```

Responses

Success

```
{
    "title": "end of the day",
    "description": "lorem 5",
    "author": "63670c94a3b390f4bc554884",
    "state": "draft",
    "read_count": 0,
    "reading_time": 1,
    "tags": [
        "punch"
    ],
    "body": "lla. Dolores porro, est asperiores ad neque nisi, quos libero minima rem dolorum earum unde possimus. Iusto quisquam enim assumenda, sequi saepe ab culpa quos natus porro commodi qui optio, laudantium architecto unde necessitatibus similique cupiditate blanditiis sed illum ea hic? Cum nam expedita, nemo pariatur aliquam temporibus nobis at quidem Officiis, maxime incidunt nulla totam magni autem quaerat repellendus sit rerum nemo ab ipsa obcaecati cumque dolorum natus consequuntur, porro qui ipsum quas aliquid excepturi iure?",
    "_id": "63670ce2a3b390f4bc554888",
    "timestamp": "2022-11-06T01:24:50.374Z",
    "__v": 0
}
```

4. #### Update Blog (only user's blogs)

- Route /blogs/:id
- Method: PUT
- Header:
  - Authorization: JWT {token}
- Body:

```
{
    "state": "published",
}
```

Responses

- Success

```
{
    "title": "end of the day",
    "description": "lorem 5",
    "author": "63670c94a3b390f4bc554884",
    "state": "published",
    "read_count": 0,
    "reading_time": 1,
    "tags": [
        "punch"
    ],
    "body": "lla. Dolores porro, est asperiores ad neque nisi, quos libero minima rem dolorum earum unde possimus. Iusto quisquam enim assumenda, sequi saepe ab culpa quos natus porro commodi qui optio, laudantium architecto unde necessitatibus similique cupiditate blanditiis sed illum ea hic? Cum nam expedita, nemo pariatur aliquam temporibus nobis at quidem Officiis, maxime incidunt nulla totam magni autem quaerat repellendus sit rerum nemo ab ipsa obcaecati cumque dolorum natus consequuntur, porro qui ipsum quas aliquid excepturi iure?",
    "_id": "63670ce2a3b390f4bc554888",
    "timestamp": "2022-11-06T01:24:50.374Z",
    "__v": 0
}
```

- Error (user trying to edit blog that he/she is not author of)

```
Not author of blog
```

5. #### Delete blog (only user's blogs)

- Route: /blogs/:id
- Method: DELETE
- Header:
  - Authorization: JWT {token}

Responses

- Success

```
{
    "message": "Blog successfully deleted"
}
```

- Error (user trying to edit blog that he/she is not author of)

```
Not author of blog
```

6. ### Get my blogs (blogs created by current user)

- Route: /blogs/me
- Method: GET
- Query Params:
  - state (draft|published)
  - limit (default:20)
  - page (default:1)
- Header:
  - Authorization: JWT {token}

Responses

Successs

```
{
    "count": 5,
    "blogs": [
        {
            "_id": "6366a92e8970de01f667ad17",
            "title": "world14523",
            "description": "Hungry1",
            "author": {
                "_id": "63631e73495b2fd44f76c5f7",
                "email": "ccyamoah@gmail.com",
                "first_name": "Cyril",
                "last_name": "Yamoah",
                "__v": 0
            },
            "state": "draft",
            "read_count": 0,
            "reading_time": 1,
            "tags": [
                "Rock"
            ],
            "body": "This is the time to get the end of the game. a win from a win get some peace went down i cant help but think of you. these 4 walls. centuries, 6 feet under. wehn all our frieds are dead. it' been jst yu and me",
            "createdAt": "2022-11-05T18:19:26.467Z",
            "updatedAt": "2022-11-05T18:19:26.467Z",
            "__v": 0
        },
        ...
    ],
    "total_pages": 1
}
```

- Error (user trying to edit blog that he/she is not author of)

```
Not author of blog
```

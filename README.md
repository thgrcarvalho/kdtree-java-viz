# kdtree-java-viz

Interactive visualization web app for the [kdtree-java](https://github.com/thgrcarvalho/kdtree-java) library. Lets you build a k-d tree by clicking points, then watch nearest-neighbor and range-search queries animate over the spatial canvas alongside the tree structure.

> **Status: work in progress.** Backend REST API is scaffolded. Frontend canvas + animations not yet implemented.

## Stack

- Spring Boot 3.4 (REST API)
- `kdtree-java` (the k-d tree algorithm itself, separate repo)
- Vanilla HTML/JS frontend (HTML5 Canvas for 2D, three.js for 3D)
- Railway for deployment

## Running locally

The viz consumes `kdtree-java` via your local Maven cache during development.

```sh
# In the kdtree-java repo:
./gradlew publishToMavenLocal

# Back in kdtree-java-viz:
./gradlew bootRun
```

Then open `http://localhost:8080`.

## REST API

| Method   | Path                       | Purpose                                |
|----------|----------------------------|----------------------------------------|
| `POST`   | `/api/tree`                | Create a new tree session              |
| `POST`   | `/api/tree/{id}/points`    | Insert a point                         |
| `GET`    | `/api/tree/{id}`           | Return tree structure                  |
| `POST`   | `/api/tree/{id}/nearest`   | Nearest-neighbor query (with trace)    |
| `POST`   | `/api/tree/{id}/range`     | Range query (with trace)               |
| `DELETE` | `/api/tree/{id}`           | Reset                                  |

## License

MIT

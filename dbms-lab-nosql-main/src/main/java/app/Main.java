
package app;

import static spark.Spark.*;
import com.google.gson.Gson;
import app.store.*;

public class Main {
    public static void main(String[] args) {
        port(8080);
        Gson gson = new Gson();

        RedisStore.init();
        HazelcastStore.init();
        MongoStore.init();

        get("/nosql-lab-rd/ogrenci_no=:id", (req, res) ->
            gson.toJson(RedisStore.get(req.params(":id"))));

        get("/nosql-lab-hz/ogrenci_no=:id", (req, res) ->
            gson.toJson(HazelcastStore.get(req.params(":id"))));

        get("/nosql-lab-mon/ogrenci_no=:id", (req, res) ->
            gson.toJson(MongoStore.get(req.params(":id"))));
    }
}

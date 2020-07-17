// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.gson.*;
import com.google.sps.UserCrud;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns the user data */
@WebServlet("/api/v1/readUser")
public class readUserServlet extends HttpServlet {
  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  UserCrud userCrud = new UserCrud(datastore);

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String email = request.getParameter("email");
    if (email == "" || email == null) {
      return;
    }
    Entity userEntity = userCrud.readUser(email);
    if (userEntity == null) {
      return;
    }
    JsonObject jsonResults = new JsonObject();
    jsonResults.addProperty("email", userEntity.getProperty("email").toString());
    jsonResults.addProperty("trips", userEntity.getProperty("trips").toString());
    response.setContentType("application/json;");
    response.getWriter().println(jsonResults);
  }
}

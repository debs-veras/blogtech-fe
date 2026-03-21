import React, { lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute, RoleProtectedRoute } from "./ProtectedRoute";

const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const SiteLayout = lazy(() => import("../layouts/SiteLayout"));
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const PostForm = lazy(() => import("../pages/Posts/form"));
const MyPosts = lazy(() => import("../pages/Posts/listing"));
const PostAllListing = lazy(() => import("../pages/Posts/allListing"));
const ViewArticle = lazy(() => import("../pages/ViewArticle"));
const Categories = lazy(() => import("../pages/Categories/listing"));
const CategoryForm = lazy(() => import("../pages/Categories/form"));
const Search = lazy(() => import("../pages/Search"));
const ChangePassword = lazy(() => import("../pages/ChangePassword"));
const UserForm = lazy(() => import("../pages/Users/form"));
const UserListing = lazy(() => import("../pages/Users/listing"));

function Router(): React.JSX.Element {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SiteLayout />,
      children: [
        {
          path: "post/:slug",
          element: <ViewArticle />,
        },
        {
          index: true,
          element: <Search />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "dashboard",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN", "AUTHOR"]}>
              <Dashboard />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "users",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <UserListing />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "user/form/:id?",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <UserForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "categorias",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <Categories />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "categoria/form",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <CategoryForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "categoria/form/:id?",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <CategoryForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "post/form/:id?",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN", "AUTHOR"]}>
              <PostForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "meus-posts",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN", "AUTHOR"]}>
              <MyPosts />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "posts",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <PostAllListing />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "configuracoes",
          element: (
            <RoleProtectedRoute allowedRoles={["ADMIN", "AUTHOR"]}>
              <ChangePassword />
            </RoleProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;

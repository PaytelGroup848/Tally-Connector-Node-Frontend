import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import FooterLandingPage from "../FooterLandingPage";
import LandingHeader from "./LandingHeader";

const BLOGS_URL = "https://api.marketing.cloudedata.com/api/blogs";

const getBlogText = (content) => {
  if (typeof content !== "string" || !content) return "";

  return new DOMParser()
    .parseFromString(content, "text/html")
    .body.textContent.replace(/\s+/g, " ")
    .trim();
};

const getBlogImage = (image) => {
  if (typeof image === "string") return image;
  if (image && typeof image === "object") {
    return image.url || image.src || image.secure_url || "";
  }
  return "";
};

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getReadingTime = (text) =>
  `${Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200))} min read`;

function BlogArtwork({ blog, featured = false }) {
  const image = getBlogImage(blog.primaryImage);

  return (
    <div
      className={`relative isolate overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-lime-700 ${
        featured ? "h-full min-h-64" : "aspect-[16/9]"
      }`}
    >
      <div className="absolute -right-10 -top-12 h-56 w-56 rounded-full border border-white/15" />
      <div className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full border border-white/15" />
      <div className="absolute inset-0" />
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) :"" }
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
        
    </div>
  );
}

function ArticleMeta({ blog, readingTime }) {
  const date = formatDate(blog.createdAt || blog.updatedAt);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
      {date && (
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          {date}
        </span>
      )}
      {blog.author && <span className="max-w-40 truncate">{blog.author}</span>}
      <span className="inline-flex items-center gap-1.5">
        <Clock3 size={14} />
        {readingTime}
      </span>
    </div>
  );
}

function BlogCard({ blog, onRead }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]">
      <div className="relative">
        <BlogArtwork blog={blog} />
        {blog.category && (
          <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-bold text-emerald-800 shadow-sm backdrop-blur">
            {blog.category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <ArticleMeta blog={blog} readingTime={blog.readingTime} />
        <h2 className="mt-4 line-clamp-2 text-xl font-extrabold leading-snug tracking-tight text-slate-900 transition group-hover:text-emerald-800">
          {blog.title || "Untitled article"}
        </h2>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
          {blog.preview ||
            "Explore ideas and practical guidance from CtrlBooks."}
        </p>
        <button
          type="button"
          onClick={() => onRead(blog)}
          className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-emerald-800 transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
        >
          Read article
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

function ArticleDialog({ blog, onClose }) {
  useEffect(() => {
    if (!blog) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [blog, onClose]);

  if (!blog) return null;

  const articleText = getBlogText(blog.description) || blog.preview;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-dialog-title"
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close article"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-slate-950/30 text-white backdrop-blur transition hover:bg-slate-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={20} />
        </button>
        <div className="h-56 sm:h-72">
          <BlogArtwork blog={blog} featured />
        </div>
        <div className="px-6 py-7 sm:px-10 sm:py-9">
          {blog.category && (
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              {blog.category}
            </span>
          )}
          <h2
            id="article-dialog-title"
            className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl"
          >
            {blog.title || "Untitled article"}
          </h2>
          <div className="mt-5">
            <ArticleMeta blog={blog} readingTime={blog.readingTime} />
          </div>
          <p className="mt-7 whitespace-pre-line text-base leading-8 text-slate-700">
            {articleText || "This article doesn’t have a description yet."}
          </p>
        </div>
      </section>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
        >
          <div className="aspect-[16/10] animate-pulse bg-slate-100" />
          <div className="space-y-4 p-6">
            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
            <div className="h-6 w-4/5 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadBlogs = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(BLOGS_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(
            `The blog service responded with ${response.status}.`,
          );
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("The blog service returned an unexpected response.");
        }

        setBlogs(
          data.filter(
            (item) =>
              item &&
              typeof item === "object" &&
              typeof item.type === "string" &&
              item.type.trim().toLowerCase() === "ctrlbooks",
          ),
        );
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load articles right now.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadBlogs();
    return () => controller.abort();
  }, [reloadCount]);

  const preparedBlogs = useMemo(
    () =>
      blogs.map((blog) => {
        const preview =
          (typeof blog.metaDescription === "string" &&
            blog.metaDescription.trim()) ||
          getBlogText(blog.description);
        const readingTime = getReadingTime(preview);

        return {
          ...blog,
          category:
            typeof blog.category === "string" ? blog.category.trim() : "",
          preview,
          readingTime,
          searchText: [
            blog.title,
            blog.category,
            blog.author,
            blog.metaDescription,
            preview,
          ]
            .filter((value) => typeof value === "string")
            .join(" ")
            .toLowerCase(),
        };
      }),
    [blogs],
  );

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return preparedBlogs.filter(
      (blog) => !query || blog.searchText.includes(query),
    );
  }, [preparedBlogs, search]);

  const navigateFromBlog = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] text-slate-900">
      <LandingHeader
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        scrollTo={(id) => navigateFromBlog(id === "home" ? "/" : `/#${id}`)}
        goToLogin={() => navigateFromBlog("/login")}
        showEnquiry={showEnquiry}
        setShowEnquiry={setShowEnquiry}
        showMobileEnquiry={false}
      />

      <main>
        <div>
          <h1 className="flex justify-center mt-2 text-3xl font-black tracking-tight text-emerald-700 sm:text-6xl">
            Blogs
          </h1>
        </div>
        <section
          id="latest-articles"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <label className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 lg:max-w-sm">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search articles..."
                aria-label="Search articles"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="mt-9">
            {isLoading ? (
              <BlogSkeleton />
            ) : error ? (
              <div className="rounded-3xl border border-rose-200 bg-white px-6 py-12 text-center shadow-sm">
                <p className="text-lg font-bold text-slate-900">
                  We couldn’t load the articles.
                </p>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => setReloadCount((count) => count + 1)}
                  className="mt-6 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                >
                  Try again
                </button>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Search size={23} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No blogs found
                </h3>
                
                
              </div>
            ) : (
              <>
                {filteredBlogs.length > 0 && (
                  <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredBlogs.map((blog, index) => (
                      <BlogCard
                        key={blog._id || blog.slug || `${blog.title}-${index}`}
                        blog={blog}
                        onRead={setSelectedBlog}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

  
      </main>

      <FooterLandingPage
        scrollTo={() => {
          window.location.href = "/#footer";
        }}
      />
      <ArticleDialog
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />
    </div>
  );
}

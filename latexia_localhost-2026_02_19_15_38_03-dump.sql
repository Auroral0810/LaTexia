--
-- PostgreSQL database dump
--

\restrict ETnb8ED3eADhqaC8xjjUPti91JAdNU4zaCegNQIO58Fnza38F1CdyhUdjdjLGa9

-- Dumped from database version 16.12 (Postgres.app)
-- Dumped by pg_dump version 16.12 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS latexia;
--
-- Name: latexia; Type: DATABASE; Schema: -; Owner: auroral
--

CREATE DATABASE latexia WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = icu LOCALE = 'en_US.UTF-8' ICU_LOCALE = 'en-US';


ALTER DATABASE latexia OWNER TO auroral;

\unrestrict ETnb8ED3eADhqaC8xjjUPti91JAdNU4zaCegNQIO58Fnza38F1CdyhUdjdjLGa9
\connect latexia
\restrict ETnb8ED3eADhqaC8xjjUPti91JAdNU4zaCegNQIO58Fnza38F1CdyhUdjdjLGa9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: latexia
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO latexia;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: auroral
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO auroral;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: auroral
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: latexia
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO latexia;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: latexia
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO latexia;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: latexia
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: __drizzle_migrations; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE public.__drizzle_migrations OWNER TO latexia;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: latexia
--

CREATE SEQUENCE public.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.__drizzle_migrations_id_seq OWNER TO latexia;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: latexia
--

ALTER SEQUENCE public.__drizzle_migrations_id_seq OWNED BY public.__drizzle_migrations.id;


--
-- Name: admin_audit_logs; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.admin_audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id uuid NOT NULL,
    action character varying(100) NOT NULL,
    target_type character varying(50),
    target_id text,
    diff jsonb,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.admin_audit_logs OWNER TO latexia;

--
-- Name: bookmark_folders; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.bookmark_folders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.bookmark_folders OWNER TO latexia;

--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.bookmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    problem_id uuid NOT NULL,
    folder_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.bookmarks OWNER TO latexia;

--
-- Name: contest_participants; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.contest_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contest_id uuid NOT NULL,
    user_id uuid NOT NULL,
    score integer DEFAULT 0,
    correct_count integer DEFAULT 0,
    rank integer,
    submitted_at timestamp with time zone,
    joined_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.contest_participants OWNER TO latexia;

--
-- Name: contests; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.contests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    status character varying(20) DEFAULT 'upcoming'::character varying,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone NOT NULL,
    duration_minutes integer NOT NULL,
    max_participants integer,
    problem_ids uuid[] NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.contests OWNER TO latexia;

--
-- Name: daily_problems; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.daily_problems (
    id integer NOT NULL,
    problem_id uuid NOT NULL,
    date date NOT NULL,
    created_by uuid
);


ALTER TABLE public.daily_problems OWNER TO latexia;

--
-- Name: daily_problems_id_seq; Type: SEQUENCE; Schema: public; Owner: latexia
--

CREATE SEQUENCE public.daily_problems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.daily_problems_id_seq OWNER TO latexia;

--
-- Name: daily_problems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: latexia
--

ALTER SEQUENCE public.daily_problems_id_seq OWNED BY public.daily_problems.id;


--
-- Name: latex_symbols; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.latex_symbols (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    latex_code character varying(200) NOT NULL,
    category character varying(50) NOT NULL,
    description text,
    example text,
    sort_order integer DEFAULT 0,
    unicode character varying(50)
);


ALTER TABLE public.latex_symbols OWNER TO latexia;

--
-- Name: latex_symbols_id_seq; Type: SEQUENCE; Schema: public; Owner: latexia
--

CREATE SEQUENCE public.latex_symbols_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.latex_symbols_id_seq OWNER TO latexia;

--
-- Name: latex_symbols_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: latexia
--

ALTER SEQUENCE public.latex_symbols_id_seq OWNED BY public.latex_symbols.id;


--
-- Name: leaderboard_snapshots; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.leaderboard_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    period_type character varying(10) NOT NULL,
    period_key character varying(20) NOT NULL,
    score integer DEFAULT 0,
    correct_count integer DEFAULT 0,
    attempt_count integer DEFAULT 0,
    accuracy_rate numeric(5,2),
    rank integer,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.leaderboard_snapshots OWNER TO latexia;

--
-- Name: learn_chapters; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.learn_chapters (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    title_en character varying(200),
    slug character varying(100),
    content text NOT NULL,
    sort_order integer DEFAULT 0,
    is_published boolean DEFAULT true,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.learn_chapters OWNER TO latexia;

--
-- Name: learn_chapters_id_seq; Type: SEQUENCE; Schema: public; Owner: latexia
--

CREATE SEQUENCE public.learn_chapters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.learn_chapters_id_seq OWNER TO latexia;

--
-- Name: learn_chapters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: latexia
--

ALTER SEQUENCE public.learn_chapters_id_seq OWNED BY public.learn_chapters.id;


--
-- Name: practice_records; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.practice_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    problem_id uuid NOT NULL,
    submitted_answer text,
    is_correct boolean NOT NULL,
    time_spent_ms integer,
    source character varying(20) DEFAULT 'practice'::character varying,
    contest_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.practice_records OWNER TO latexia;

--
-- Name: problem_categories; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.problem_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    name_en character varying(100),
    slug character varying(100) NOT NULL,
    parent_id integer,
    icon character varying(50),
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.problem_categories OWNER TO latexia;

--
-- Name: problem_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: latexia
--

CREATE SEQUENCE public.problem_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.problem_categories_id_seq OWNER TO latexia;

--
-- Name: problem_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: latexia
--

ALTER SEQUENCE public.problem_categories_id_seq OWNED BY public.problem_categories.id;


--
-- Name: problem_feedbacks; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.problem_feedbacks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    problem_id uuid NOT NULL,
    user_id uuid NOT NULL,
    error_type character varying(50) NOT NULL,
    description text NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    admin_note text,
    handled_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.problem_feedbacks OWNER TO latexia;

--
-- Name: problem_tags; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.problem_tags (
    problem_id uuid NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.problem_tags OWNER TO latexia;

--
-- Name: problems; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.problems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(500) NOT NULL,
    content text NOT NULL,
    type character varying(20) NOT NULL,
    difficulty character varying(10) NOT NULL,
    category_id integer,
    options jsonb,
    answer text NOT NULL,
    answer_explanation text,
    preview_image_url text,
    score integer DEFAULT 10,
    status character varying(20) DEFAULT 'published'::character varying,
    author_id uuid,
    attempt_count integer DEFAULT 0,
    correct_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.problems OWNER TO latexia;

--
-- Name: review_plans; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.review_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    problem_id uuid NOT NULL,
    stage integer DEFAULT 1,
    next_review_at timestamp with time zone NOT NULL,
    last_reviewed_at timestamp with time zone,
    is_completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.review_plans OWNER TO latexia;

--
-- Name: system_configs; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.system_configs (
    key character varying(100) NOT NULL,
    value jsonb NOT NULL,
    description text,
    updated_by uuid,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.system_configs OWNER TO latexia;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    color character varying(7)
);


ALTER TABLE public.tags OWNER TO latexia;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: latexia
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO latexia;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: latexia
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: tool_recommendations; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.tool_recommendations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    url text NOT NULL,
    category character varying(50) NOT NULL,
    logo_url text,
    tags text[],
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    level character varying(50)
);


ALTER TABLE public.tool_recommendations OWNER TO latexia;

--
-- Name: tool_recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: latexia
--

CREATE SEQUENCE public.tool_recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tool_recommendations_id_seq OWNER TO latexia;

--
-- Name: tool_recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: latexia
--

ALTER SEQUENCE public.tool_recommendations_id_seq OWNED BY public.tool_recommendations.id;


--
-- Name: user_learn_progress; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.user_learn_progress (
    user_id uuid NOT NULL,
    chapter_id integer NOT NULL,
    is_completed boolean DEFAULT false,
    completed_at timestamp with time zone
);


ALTER TABLE public.user_learn_progress OWNER TO latexia;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.user_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    refresh_token_hash character varying(255) NOT NULL,
    user_agent text,
    ip_address inet,
    device_name character varying(100),
    is_revoked boolean DEFAULT false,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_sessions OWNER TO latexia;

--
-- Name: users; Type: TABLE; Schema: public; Owner: latexia
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255),
    phone character varying(20),
    password_hash character varying(255),
    avatar_url text,
    bio text,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    github_id character varying(50),
    google_id character varying(50),
    apple_id character varying(255),
    locale character varying(10) DEFAULT 'zh-CN'::character varying,
    theme character varying(10) DEFAULT 'system'::character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_login_at timestamp with time zone,
    qq_id character varying(50),
    wechat_id character varying(50)
);


ALTER TABLE public.users OWNER TO latexia;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: latexia
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('public.__drizzle_migrations_id_seq'::regclass);


--
-- Name: daily_problems id; Type: DEFAULT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.daily_problems ALTER COLUMN id SET DEFAULT nextval('public.daily_problems_id_seq'::regclass);


--
-- Name: latex_symbols id; Type: DEFAULT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.latex_symbols ALTER COLUMN id SET DEFAULT nextval('public.latex_symbols_id_seq'::regclass);


--
-- Name: learn_chapters id; Type: DEFAULT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.learn_chapters ALTER COLUMN id SET DEFAULT nextval('public.learn_chapters_id_seq'::regclass);


--
-- Name: problem_categories id; Type: DEFAULT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_categories ALTER COLUMN id SET DEFAULT nextval('public.problem_categories_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: tool_recommendations id; Type: DEFAULT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.tool_recommendations ALTER COLUMN id SET DEFAULT nextval('public.tool_recommendations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: latexia
--


--
-- Data for Name: admin_audit_logs; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: bookmark_folders; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: bookmarks; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: contest_participants; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: contests; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: daily_problems; Type: TABLE DATA; Schema: public; Owner: latexia
--




--
-- Data for Name: leaderboard_snapshots; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: practice_records; Type: TABLE DATA; Schema: public; Owner: latexia
--


--
-- Data for Name: problem_feedbacks; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: problem_tags; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: problems; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: review_plans; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: system_configs; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: latexia
--



--
-- Data for Name: user_learn_progress; Type: TABLE DATA; Schema: public; Owner: latexia
--




--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: latexia
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, true);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: latexia
--

SELECT pg_catalog.setval('public.__drizzle_migrations_id_seq', 2, true);


--
-- Name: daily_problems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: latexia
--

SELECT pg_catalog.setval('public.daily_problems_id_seq', 1, false);


--
-- Name: latex_symbols_id_seq; Type: SEQUENCE SET; Schema: public; Owner: latexia
--

SELECT pg_catalog.setval('public.latex_symbols_id_seq', 10399, true);


--
-- Name: learn_chapters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: latexia
--

SELECT pg_catalog.setval('public.learn_chapters_id_seq', 6, true);


--
-- Name: problem_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: latexia
--

SELECT pg_catalog.setval('public.problem_categories_id_seq', 9, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: latexia
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, false);


--
-- Name: tool_recommendations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: latexia
--

SELECT pg_catalog.setval('public.tool_recommendations_id_seq', 45, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: latexia
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: admin_audit_logs admin_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: bookmark_folders bookmark_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.bookmark_folders
    ADD CONSTRAINT bookmark_folders_pkey PRIMARY KEY (id);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: contest_participants contest_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.contest_participants
    ADD CONSTRAINT contest_participants_pkey PRIMARY KEY (id);


--
-- Name: contests contests_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.contests
    ADD CONSTRAINT contests_pkey PRIMARY KEY (id);


--
-- Name: daily_problems daily_problems_date_unique; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.daily_problems
    ADD CONSTRAINT daily_problems_date_unique UNIQUE (date);


--
-- Name: daily_problems daily_problems_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.daily_problems
    ADD CONSTRAINT daily_problems_pkey PRIMARY KEY (id);


--
-- Name: latex_symbols latex_symbols_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.latex_symbols
    ADD CONSTRAINT latex_symbols_pkey PRIMARY KEY (id);


--
-- Name: leaderboard_snapshots leaderboard_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.leaderboard_snapshots
    ADD CONSTRAINT leaderboard_snapshots_pkey PRIMARY KEY (id);


--
-- Name: learn_chapters learn_chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.learn_chapters
    ADD CONSTRAINT learn_chapters_pkey PRIMARY KEY (id);


--
-- Name: learn_chapters learn_chapters_slug_unique; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.learn_chapters
    ADD CONSTRAINT learn_chapters_slug_unique UNIQUE (slug);


--
-- Name: practice_records practice_records_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.practice_records
    ADD CONSTRAINT practice_records_pkey PRIMARY KEY (id);


--
-- Name: problem_categories problem_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_categories
    ADD CONSTRAINT problem_categories_pkey PRIMARY KEY (id);


--
-- Name: problem_categories problem_categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_categories
    ADD CONSTRAINT problem_categories_slug_unique UNIQUE (slug);


--
-- Name: problem_feedbacks problem_feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_feedbacks
    ADD CONSTRAINT problem_feedbacks_pkey PRIMARY KEY (id);


--
-- Name: problem_tags problem_tags_problem_id_tag_id_pk; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_tags
    ADD CONSTRAINT problem_tags_problem_id_tag_id_pk PRIMARY KEY (problem_id, tag_id);


--
-- Name: problems problems_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problems
    ADD CONSTRAINT problems_pkey PRIMARY KEY (id);


--
-- Name: review_plans review_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.review_plans
    ADD CONSTRAINT review_plans_pkey PRIMARY KEY (id);


--
-- Name: system_configs system_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.system_configs
    ADD CONSTRAINT system_configs_pkey PRIMARY KEY (key);


--
-- Name: tags tags_name_unique; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_unique UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tool_recommendations tool_recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.tool_recommendations
    ADD CONSTRAINT tool_recommendations_pkey PRIMARY KEY (id);


--
-- Name: user_learn_progress user_learn_progress_user_id_chapter_id_pk; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.user_learn_progress
    ADD CONSTRAINT user_learn_progress_user_id_chapter_id_pk PRIMARY KEY (user_id, chapter_id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_apple_id_unique; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_apple_id_unique UNIQUE (apple_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_github_id_unique; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_github_id_unique UNIQUE (github_id);


--
-- Name: users users_google_id_unique; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_id_unique UNIQUE (google_id);


--
-- Name: users users_phone_unique; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_unique UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_qq_id_key; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_qq_id_key UNIQUE (qq_id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: users users_wechat_id_key; Type: CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_wechat_id_key UNIQUE (wechat_id);


--
-- Name: idx_bookmark_user_problem; Type: INDEX; Schema: public; Owner: latexia
--

CREATE UNIQUE INDEX idx_bookmark_user_problem ON public.bookmarks USING btree (user_id, problem_id);


--
-- Name: idx_contest_user; Type: INDEX; Schema: public; Owner: latexia
--

CREATE UNIQUE INDEX idx_contest_user ON public.contest_participants USING btree (contest_id, user_id);


--
-- Name: idx_leaderboard_period_score; Type: INDEX; Schema: public; Owner: latexia
--

CREATE INDEX idx_leaderboard_period_score ON public.leaderboard_snapshots USING btree (period_type, period_key, score);


--
-- Name: idx_leaderboard_user_period; Type: INDEX; Schema: public; Owner: latexia
--

CREATE UNIQUE INDEX idx_leaderboard_user_period ON public.leaderboard_snapshots USING btree (user_id, period_type, period_key);


--
-- Name: idx_practice_user_created; Type: INDEX; Schema: public; Owner: latexia
--

CREATE INDEX idx_practice_user_created ON public.practice_records USING btree (user_id, created_at);


--
-- Name: idx_practice_user_problem; Type: INDEX; Schema: public; Owner: latexia
--

CREATE INDEX idx_practice_user_problem ON public.practice_records USING btree (user_id, problem_id);


--
-- Name: idx_review_user_problem; Type: INDEX; Schema: public; Owner: latexia
--

CREATE UNIQUE INDEX idx_review_user_problem ON public.review_plans USING btree (user_id, problem_id);


--
-- Name: admin_audit_logs admin_audit_logs_admin_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_admin_id_users_id_fk FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- Name: bookmark_folders bookmark_folders_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.bookmark_folders
    ADD CONSTRAINT bookmark_folders_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: bookmarks bookmarks_folder_id_bookmark_folders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_folder_id_bookmark_folders_id_fk FOREIGN KEY (folder_id) REFERENCES public.bookmark_folders(id);


--
-- Name: bookmarks bookmarks_problem_id_problems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_problem_id_problems_id_fk FOREIGN KEY (problem_id) REFERENCES public.problems(id);


--
-- Name: bookmarks bookmarks_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: contest_participants contest_participants_contest_id_contests_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.contest_participants
    ADD CONSTRAINT contest_participants_contest_id_contests_id_fk FOREIGN KEY (contest_id) REFERENCES public.contests(id);


--
-- Name: contest_participants contest_participants_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.contest_participants
    ADD CONSTRAINT contest_participants_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: contests contests_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.contests
    ADD CONSTRAINT contests_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: daily_problems daily_problems_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.daily_problems
    ADD CONSTRAINT daily_problems_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: daily_problems daily_problems_problem_id_problems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.daily_problems
    ADD CONSTRAINT daily_problems_problem_id_problems_id_fk FOREIGN KEY (problem_id) REFERENCES public.problems(id);


--
-- Name: leaderboard_snapshots leaderboard_snapshots_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.leaderboard_snapshots
    ADD CONSTRAINT leaderboard_snapshots_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: practice_records practice_records_contest_id_contests_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.practice_records
    ADD CONSTRAINT practice_records_contest_id_contests_id_fk FOREIGN KEY (contest_id) REFERENCES public.contests(id);


--
-- Name: practice_records practice_records_problem_id_problems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.practice_records
    ADD CONSTRAINT practice_records_problem_id_problems_id_fk FOREIGN KEY (problem_id) REFERENCES public.problems(id);


--
-- Name: practice_records practice_records_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.practice_records
    ADD CONSTRAINT practice_records_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: problem_categories problem_categories_parent_id_problem_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_categories
    ADD CONSTRAINT problem_categories_parent_id_problem_categories_id_fk FOREIGN KEY (parent_id) REFERENCES public.problem_categories(id);


--
-- Name: problem_feedbacks problem_feedbacks_handled_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_feedbacks
    ADD CONSTRAINT problem_feedbacks_handled_by_users_id_fk FOREIGN KEY (handled_by) REFERENCES public.users(id);


--
-- Name: problem_feedbacks problem_feedbacks_problem_id_problems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_feedbacks
    ADD CONSTRAINT problem_feedbacks_problem_id_problems_id_fk FOREIGN KEY (problem_id) REFERENCES public.problems(id);


--
-- Name: problem_feedbacks problem_feedbacks_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_feedbacks
    ADD CONSTRAINT problem_feedbacks_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: problem_tags problem_tags_problem_id_problems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_tags
    ADD CONSTRAINT problem_tags_problem_id_problems_id_fk FOREIGN KEY (problem_id) REFERENCES public.problems(id);


--
-- Name: problem_tags problem_tags_tag_id_tags_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problem_tags
    ADD CONSTRAINT problem_tags_tag_id_tags_id_fk FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- Name: problems problems_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problems
    ADD CONSTRAINT problems_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: problems problems_category_id_problem_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.problems
    ADD CONSTRAINT problems_category_id_problem_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.problem_categories(id);


--
-- Name: review_plans review_plans_problem_id_problems_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.review_plans
    ADD CONSTRAINT review_plans_problem_id_problems_id_fk FOREIGN KEY (problem_id) REFERENCES public.problems(id);


--
-- Name: review_plans review_plans_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.review_plans
    ADD CONSTRAINT review_plans_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: system_configs system_configs_updated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.system_configs
    ADD CONSTRAINT system_configs_updated_by_users_id_fk FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: tool_recommendations tool_recommendations_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.tool_recommendations
    ADD CONSTRAINT tool_recommendations_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: user_learn_progress user_learn_progress_chapter_id_learn_chapters_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.user_learn_progress
    ADD CONSTRAINT user_learn_progress_chapter_id_learn_chapters_id_fk FOREIGN KEY (chapter_id) REFERENCES public.learn_chapters(id);


--
-- Name: user_learn_progress user_learn_progress_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.user_learn_progress
    ADD CONSTRAINT user_learn_progress_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_sessions user_sessions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: latexia
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DATABASE latexia; Type: ACL; Schema: -; Owner: auroral
--

GRANT ALL ON DATABASE latexia TO latexia;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: auroral
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO latexia;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict ETnb8ED3eADhqaC8xjjUPti91JAdNU4zaCegNQIO58Fnza38F1CdyhUdjdjLGa9


from datetime import date
import streamlit as st
from ai_chat import study_chat
from summarizer import summarize_text
from quiz_generator import generate_quiz
from speech_to_text import transcribe_audio
from study_planner import generate_study_plan


def format_gemini_error(e: Exception, action: str) -> str:
    message = str(e)
    if "HF_API_TOKEN is missing" in message:
        return message
    if "RESOURCE_EXHAUSTED" in message or "quota" in message:
        return (
            f"Gemini quota exceeded while {action}. "
            "Your current plan/free tier has run out of usage for this model. "
            "Check your plan and billing on ai.google.dev, or wait a bit and try again."
        )
    return f"Sorry, something went wrong while {action}: `{message}`"


st.set_page_config(
    page_title="AI Study Buddy",
    layout="wide",
    page_icon="📚",
)


st.markdown(
    """
    <style>
    /* App-wide tweaks for a more modern look */
    .main {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
    }
    .block-container {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)


st.title("📚 AI Study Buddy + Voice Notes")
st.caption("Powered by Gemini and Whisper – your all‑in‑one learning copilot.")


with st.sidebar:
    st.header("Settings")
    default_level = st.selectbox(
        "Default explanation level",
        ["Beginner", "Intermediate", "Advanced"],
        index=0,
        key="default_level",
    )
    st.markdown("---")
    st.markdown(
        """
        **Tips**
        - Ask specific questions for better answers  
        - Paste clean notes for high‑quality summaries  
        - Use short audio clips when testing voice notes  
        - In Study Planner, list subjects and set a deadline for a custom schedule
        """
    )


tab_chat, tab_notes, tab_voice, tab_quiz, tab_planner = st.tabs(
    ["💬 AI Chat", "📝 Notes Summarizer", "🎤 Voice to Notes", "🧠 Quiz Generator", "📅 Study Planner"]
)


if "chat_history" not in st.session_state:
    st.session_state.chat_history = []


with tab_chat:
    st.subheader("Study Chat")

    col_left, col_right = st.columns([3, 1])

    with col_right:
        level = st.selectbox(
            "Explanation level",
            ["Beginner", "Intermediate", "Advanced"],
            index=["Beginner", "Intermediate", "Advanced"].index(default_level),
            key="chat_level",
        )

    # Show chat history
    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    user_msg = st.chat_input("Ask your study question…")

    if user_msg:
        st.session_state.chat_history.append(
            {"role": "user", "content": user_msg}
        )
        with st.chat_message("user"):
            st.markdown(user_msg)

        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                try:
                    answer = study_chat(user_msg, level)
                except Exception as e:
                    answer = format_gemini_error(e, "answering your question")
                st.markdown(answer)

        st.session_state.chat_history.append(
            {"role": "assistant", "content": answer}
        )


with tab_notes:
    st.subheader("Notes Summarizer")

    col_input, col_info = st.columns([3, 1])

    with col_input:
        text = st.text_area(
            "Paste your notes here",
            height=220,
            placeholder="Paste textbook paragraphs, lecture notes, or articles…",
        )
        summarize_button = st.button("Summarize Notes", type="primary")

    with col_info:
        st.markdown("**What you get**")
        st.markdown(
            "- Key points and concepts\n"
            "- Bullet‑style study notes\n"
            "- Concise overview for revision"
        )

    if summarize_button and text.strip():
        with st.spinner("Summarizing your notes..."):
            try:
                summary = summarize_text(text)
            except Exception as e:
                st.error(format_gemini_error(e, "summarizing your notes"))
            else:
                if summary == "This is for study purposes only.":
                    st.warning(summary)
                else:
                    st.markdown("### Summary")
                    st.write(summary)

                    st.download_button(
                        "Download Summary as TXT",
                        data=summary,
                        file_name="study_summary.txt",
                        mime="text/plain",
                    )


with tab_voice:
    st.subheader("Voice to Notes")

    col_upload, col_help = st.columns([2, 1])

    with col_upload:
        audio_file = st.file_uploader(
            "Upload lecture audio",
            type=["mp3", "wav", "m4a"],
        )

    with col_help:
        st.markdown("**Best results**")
        st.markdown(
            "- Clear speech, minimal noise\n"
            "- Clips under ~15 minutes for testing\n"
            "- One speaker when possible"
        )

    if audio_file is not None:
        with st.spinner("Transcribing audio... this may take a moment."):
            try:
                transcript = transcribe_audio(audio_file)
            except Exception as e:
                st.error(format_gemini_error(e, "transcribing your audio"))
                transcript = None

        if transcript:
            with st.expander("🔍 View Full Transcript"):
                st.write(transcript)

            with st.spinner("Turning transcript into concise notes..."):
                try:
                    summary = summarize_text(transcript)
                except Exception as e:
                    st.error(format_gemini_error(e, "summarizing the transcript"))
                else:
                    if summary == "This is for study purposes only.":
                        st.warning(summary)
                    else:
                        st.markdown("### Generated Notes")
                        st.write(summary)


with tab_quiz:
    st.subheader("Quiz Generator")

    # Session state for interactive quiz
    if "quiz_questions" not in st.session_state:
        st.session_state.quiz_questions = None
    if "quiz_index" not in st.session_state:
        st.session_state.quiz_index = 0
    if "quiz_answers" not in st.session_state:
        st.session_state.quiz_answers = []

    def start_new_quiz():
        st.session_state.quiz_questions = None
        st.session_state.quiz_index = 0
        st.session_state.quiz_answers = []

    questions = st.session_state.quiz_questions
    qidx = st.session_state.quiz_index
    answers = st.session_state.quiz_answers

    # --- No quiz yet: show text area and generate ---
    if questions is None:
        col_quiz_input, col_quiz_info = st.columns([3, 1])

        with col_quiz_input:
            quiz_mode = st.radio(
                "Generate quiz from",
                ["Topic", "Paste text"],
                horizontal=True,
                key="quiz_mode",
            )

            quiz_topic = ""
            quiz_text = ""

            if quiz_mode == "Topic":
                quiz_topic = st.text_input(
                    "Study topic",
                    placeholder="e.g. Artificial Intelligence, Photosynthesis, Python OOP",
                    key="quiz_topic",
                )
                st.caption("Tip: Add a chapter/unit name for better quizzes (e.g. “AI: search algorithms”).")
            else:
                quiz_text = st.text_area(
                    "Paste study material",
                    height=220,
                    placeholder="Paste notes, a textbook passage, or concept explanation (study content only).",
                    key="quiz_text",
                )

            generate_btn = st.button("Generate Quiz", type="primary", key="quiz_generate")

        with col_quiz_info:
            st.markdown("**Quiz flow**")
            st.markdown(
                "- Click an option as your answer\n"
                "- See explanation, then Next\n"
                "- New quiz to reset or try new material"
            )

        if generate_btn and (quiz_text.strip() or quiz_topic.strip()):
            with st.spinner("Generating quiz..."):
                try:
                    result = generate_quiz(text=quiz_text, topic=quiz_topic)
                except Exception as e:
                    st.error(format_gemini_error(e, "generating your quiz"))
                else:
                    if result.get("study_only"):
                        st.warning(result.get("message", "This is for study purposes only."))
                    elif result.get("error"):
                        st.error(result["error"])
                    else:
                        qs = result.get("questions") or []
                        st.session_state.quiz_questions = qs
                        st.session_state.quiz_index = 0
                        st.session_state.quiz_answers = [None] * len(qs)
                        st.rerun()

    # --- Quiz active: show one question at a time ---
    else:
        total = len(questions)
        current = questions[qidx]
        question_text = current.get("question", "")
        options = current.get("options") or []
        correct_index = current.get("correct_index", 0)
        explanation = current.get("explanation", "")

        st.button("🔄 New quiz", on_click=start_new_quiz, key="quiz_new_top")
        st.markdown("---")
        st.caption(f"Question {qidx + 1} of {total}")

        st.markdown(f"**{question_text}**")

        selected = answers[qidx] if qidx < len(answers) else None

        # Option buttons
        for i, opt in enumerate(options):
            if selected is None:
                if st.button(opt, key=f"opt_{qidx}_{i}"):
                    st.session_state.quiz_answers[qidx] = i
                    st.rerun()
            else:
                # Already answered: show option with correct/incorrect styling
                is_correct = i == correct_index
                if i == selected:
                    label = "✓ " + opt if is_correct else "✗ " + opt
                else:
                    label = opt
                if is_correct:
                    st.success(label)
                elif i == selected:
                    st.error(label)
                else:
                    st.markdown(label)

        # Show explanation and Next / New quiz after answer
        if selected is not None:
            st.markdown("**Explanation**")
            st.info(explanation)

            col_a, col_b, _ = st.columns([1, 1, 2])
            with col_a:
                if qidx < total - 1:
                    if st.button("Next question →", key="quiz_next"):
                        st.session_state.quiz_index = qidx + 1
                        st.rerun()
                else:
                    score = sum(1 for j, q in enumerate(questions) if answers[j] == q.get("correct_index", -1))
                    st.metric("Score", f"{score} / {total}")
            with col_b:
                if st.button("🔄 New quiz", key="quiz_new_bottom"):
                    start_new_quiz()
                    st.rerun()


with tab_planner:
    st.subheader("Study Planner")

    col_plan_input, col_plan_help = st.columns([3, 1])

    with col_plan_input:
        planner_topics = st.text_area(
            "Subjects or topics to cover",
            height=120,
            placeholder="e.g. Calculus Ch 1–3, Biology Cell Division, History WWI",
            key="planner_topics",
        )
        row1, row2 = st.columns(2)
        with row1:
            planner_deadline_date = st.date_input(
                "Deadline / exam date",
                min_value=date.today(),
                key="planner_deadline_date",
            )
            planner_hours = st.selectbox(
                "Hours per day you can study",
                ["1", "2", "3", "4", "5", "6+"],
                index=1,
                key="planner_hours",
            )
        with row2:
            planner_days = st.selectbox(
                "Days per week you can study",
                ["3", "4", "5", "6", "7"],
                index=4,
                key="planner_days",
            )
        plan_btn = st.button("Generate study plan", type="primary", key="planner_btn")

    with col_plan_help:
        st.markdown("**You get**")
        st.markdown(
            "- Week-by-week or day-by-week breakdown\n"
            "- Time per topic and session tips\n"
            "- Study-only; non-study topics get a reminder"
        )

    if plan_btn and planner_topics.strip():
        with st.spinner("Creating your study plan..."):
            try:
                plan = generate_study_plan(
                    topics=planner_topics.strip(),
                    start_date="",
                    end_date=str(planner_deadline_date),
                    hours_per_day=planner_hours,
                    days_per_week=planner_days,
                )
            except Exception as e:
                st.error(format_gemini_error(e, "generating your study plan"))
            else:
                if plan == "This is for study purposes only." or not plan:
                    st.warning("This is for study purposes only.")
                else:
                    st.markdown("### Your study plan")
                    st.markdown(plan)
                    st.download_button(
                        "Download plan as TXT",
                        data=plan,
                        file_name="study_plan.txt",
                        mime="text/plain",
                        key="planner_download",
                    )



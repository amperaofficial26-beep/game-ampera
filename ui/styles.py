"""CSS dan helper tampilan global untuk Streamlit."""

import streamlit as st


def apply_global_styles() -> None:
    """Memasang styling ringan tanpa dependency CSS eksternal."""
    st.markdown(
        """
        <style>
            .block-container {
                max-width: 1200px;
                padding-top: 2rem;
                padding-bottom: 3rem;
            }
            .tf-floor {
                border: 1px solid rgba(99, 102, 241, 0.35);
                border-radius: 10px;
                background: rgba(99, 102, 241, 0.08);
                padding: 0.65rem 0.85rem;
                margin: 0.35rem 0;
            }
            .tf-empty-floor {
                border: 1px dashed rgba(148, 163, 184, 0.65);
                border-radius: 10px;
                color: #94a3b8;
                padding: 0.65rem 0.85rem;
                margin: 0.35rem 0;
            }
            .tf-caption {
                color: #94a3b8;
                font-size: 0.9rem;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )

<script>
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    export let data;
    export let form;

    let editorContent = data.post.body;
    let editorElement;

    onMount(() => {
        if (editorElement) {
            editorElement.innerHTML = data.post.body;
        }
    });

    // Rich text editor functions
    function execCommand(command, value = null) {
        document.execCommand(command, false, value);
    }

    function insertLink() {
        const url = prompt("Enter URL:");
        if (url) execCommand("createLink", url);
    }

    function insertImage() {
        const url = prompt("Enter image URL:");
        if (url) execCommand("insertImage", url);
    }

    function handleEditorInput(e) {
        editorContent = e.target.innerHTML;
    }
</script>

<div class="container" style="max-width: 900px;">
    <div class="flex justify-between items-center mb-6">
        <h1 class="heading-1">Edit Post</h1>
        <a href="/admin/posts" class="btn btn-outline">Cancel</a>
    </div>

    {#if form?.error}
        <div class="alert alert-error">
            {form.error}
        </div>
    {/if}

    <form method="POST" use:enhance class="card">
        <div class="flex flex-col gap-4">
            <div>
                <label for="title" class="label">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    class="input"
                    required
                    value={data.post.title}
                    placeholder="My Awesome Blog Post"
                />
            </div>

            <div>
                <label for="slug" class="label">Slug</label>
                <input
                    type="text"
                    name="slug"
                    id="slug"
                    class="input"
                    required
                    value={data.post.slug}
                    placeholder="my-awesome-blog-post"
                />
                <p
                    class="text-sm text-muted"
                    style="margin-top: var(--space-2);"
                >
                    URL-friendly version of the title.
                </p>
            </div>

            <div>
                <label for="body" class="label">Body</label>

                <!-- Rich Text Editor Toolbar -->
                <div class="editor-toolbar">
                    <!-- Text Formatting -->
                    <div class="toolbar-group">
                        <button
                            type="button"
                            on:click={() => execCommand("bold")}
                            class="toolbar-btn"
                            title="Bold (Ctrl+B)"
                        >
                            <strong>B</strong>
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("italic")}
                            class="toolbar-btn"
                            title="Italic (Ctrl+I)"
                        >
                            <em>I</em>
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("underline")}
                            class="toolbar-btn"
                            title="Underline (Ctrl+U)"
                        >
                            <u>U</u>
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("strikeThrough")}
                            class="toolbar-btn"
                            title="Strikethrough"
                        >
                            <s>S</s>
                        </button>
                    </div>

                    <span class="toolbar-divider"></span>

                    <!-- Headings & Blocks -->
                    <div class="toolbar-group">
                        <button
                            type="button"
                            on:click={() => execCommand("formatBlock", "<h1>")}
                            class="toolbar-btn"
                            title="Heading 1"
                        >
                            H1
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("formatBlock", "<h2>")}
                            class="toolbar-btn"
                            title="Heading 2"
                        >
                            H2
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("formatBlock", "<h3>")}
                            class="toolbar-btn"
                            title="Heading 3"
                        >
                            H3
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("formatBlock", "<p>")}
                            class="toolbar-btn"
                            title="Paragraph"
                        >
                            P
                        </button>
                        <button
                            type="button"
                            on:click={() =>
                                execCommand("formatBlock", "<blockquote>")}
                            class="toolbar-btn"
                            title="Quote"
                        >
                            "
                        </button>
                    </div>

                    <span class="toolbar-divider"></span>

                    <!-- Lists & Indentation -->
                    <div class="toolbar-group">
                        <button
                            type="button"
                            on:click={() => execCommand("insertUnorderedList")}
                            class="toolbar-btn"
                            title="Bullet List"
                        >
                            • List
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("insertOrderedList")}
                            class="toolbar-btn"
                            title="Numbered List"
                        >
                            1. List
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("indent")}
                            class="toolbar-btn"
                            title="Indent"
                        >
                            →
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("outdent")}
                            class="toolbar-btn"
                            title="Outdent"
                        >
                            ←
                        </button>
                    </div>

                    <span class="toolbar-divider"></span>

                    <!-- Alignment -->
                    <div class="toolbar-group">
                        <button
                            type="button"
                            on:click={() => execCommand("justifyLeft")}
                            class="toolbar-btn"
                            title="Align Left"
                        >
                            ⬅
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("justifyCenter")}
                            class="toolbar-btn"
                            title="Center"
                        >
                            ⬌
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("justifyRight")}
                            class="toolbar-btn"
                            title="Align Right"
                        >
                            ➡
                        </button>
                    </div>

                    <span class="toolbar-divider"></span>

                    <!-- Insert -->
                    <div class="toolbar-group">
                        <button
                            type="button"
                            on:click={insertLink}
                            class="toolbar-btn"
                            title="Insert Link"
                        >
                            🔗 Link
                        </button>
                        <button
                            type="button"
                            on:click={insertImage}
                            class="toolbar-btn"
                            title="Insert Image"
                        >
                            🖼️ Image
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("insertHTML", "<hr>")}
                            class="toolbar-btn"
                            title="Horizontal Rule"
                        >
                            ― HR
                        </button>
                    </div>

                    <span class="toolbar-divider"></span>

                    <!-- Colors -->
                    <div class="toolbar-group">
                        <label class="color-picker-label" title="Text Color">
                            <span>A</span>
                            <input
                                type="color"
                                on:change={(e) =>
                                    execCommand("foreColor", e.target.value)}
                                class="color-picker"
                            />
                        </label>
                        <label class="color-picker-label" title="Highlight">
                            <span>◼</span>
                            <input
                                type="color"
                                on:change={(e) =>
                                    execCommand("backColor", e.target.value)}
                                class="color-picker"
                            />
                        </label>
                    </div>

                    <span class="toolbar-divider"></span>

                    <!-- Edit -->
                    <div class="toolbar-group">
                        <button
                            type="button"
                            on:click={() => execCommand("undo")}
                            class="toolbar-btn"
                            title="Undo (Ctrl+Z)"
                        >
                            ↶
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("redo")}
                            class="toolbar-btn"
                            title="Redo (Ctrl+Y)"
                        >
                            ↷
                        </button>
                        <button
                            type="button"
                            on:click={() => execCommand("removeFormat")}
                            class="toolbar-btn"
                            title="Clear Formatting"
                        >
                            ✕ Clear
                        </button>
                    </div>
                </div>

                <!-- Rich Text Editor -->
                <div
                    bind:this={editorElement}
                    contenteditable="true"
                    class="rich-editor"
                    on:input={handleEditorInput}
                    placeholder="Write your post content here... Use the toolbar above to format your text."
                ></div>

                <!-- Hidden input to submit content -->
                <input
                    type="hidden"
                    name="body"
                    bind:value={editorContent}
                    required
                />

                <p
                    class="text-sm text-muted"
                    style="margin-top: var(--space-2);"
                >
                    💡 <strong>Tips:</strong> Select text to format it. Use keyboard
                    shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline).
                </p>
            </div>

            <div class="flex gap-2">
                <button type="submit" class="btn btn-primary"
                    >Update Post</button
                >
                <a href="/admin/posts" class="btn btn-outline">Cancel</a>
            </div>
        </div>
    </form>
</div>

<style>
    .editor-toolbar {
        display: flex;
        gap: 8px;
        padding: 12px;
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-bottom: none;
        border-radius: 8px 8px 0 0;
        flex-wrap: wrap;
        align-items: center;
    }

    .toolbar-group {
        display: flex;
        gap: 4px;
    }

    .toolbar-btn {
        padding: 6px 10px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
        white-space: nowrap;
    }

    .toolbar-btn:hover {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }

    .toolbar-btn:active {
        transform: scale(0.95);
    }

    .toolbar-divider {
        width: 1px;
        height: 24px;
        background: var(--color-border);
    }

    .color-picker-label {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 6px 10px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
    }

    .color-picker-label:hover {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }

    .color-picker {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .rich-editor {
        min-height: 400px;
        max-height: 600px;
        overflow-y: auto;
        padding: var(--space-4);
        border: 1px solid var(--color-border);
        border-radius: 0 0 8px 8px;
        background: var(--color-surface);
        font-family: inherit;
        font-size: var(--font-size-base);
        line-height: 1.7;
        outline: none;
    }

    .rich-editor:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
    }

    .rich-editor:empty:before {
        content: attr(placeholder);
        color: var(--color-text-muted);
    }

    /* Style content inside editor */
    .rich-editor :global(h1) {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        margin-top: var(--space-6);
        margin-bottom: var(--space-3);
        line-height: 1.2;
    }

    .rich-editor :global(h2) {
        font-size: var(--font-size-xl);
        font-weight: 600;
        margin-top: var(--space-5);
        margin-bottom: var(--space-2);
        line-height: 1.3;
    }

    .rich-editor :global(h3) {
        font-size: var(--font-size-lg);
        font-weight: 600;
        margin-top: var(--space-4);
        margin-bottom: var(--space-2);
        line-height: 1.4;
    }

    .rich-editor :global(p) {
        margin-bottom: var(--space-3);
    }

    .rich-editor :global(ul),
    .rich-editor :global(ol) {
        margin-bottom: var(--space-3);
        padding-left: var(--space-6);
    }

    .rich-editor :global(li) {
        margin-bottom: var(--space-2);
    }

    .rich-editor :global(a) {
        color: var(--color-primary);
        text-decoration: underline;
    }

    .rich-editor :global(blockquote) {
        border-left: 4px solid var(--color-primary);
        padding-left: var(--space-4);
        margin-left: 0;
        margin-bottom: var(--space-4);
        font-style: italic;
        color: var(--color-text-muted);
    }

    .rich-editor :global(hr) {
        border: none;
        border-top: 2px solid var(--color-border);
        margin: var(--space-6) 0;
    }

    .rich-editor :global(img) {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: var(--space-4) 0;
    }

    .rich-editor :global(code) {
        background: var(--color-bg);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9em;
    }

    .rich-editor :global(pre) {
        background: var(--color-bg);
        padding: var(--space-4);
        border-radius: 8px;
        overflow-x: auto;
        margin-bottom: var(--space-4);
    }

    .rich-editor :global(pre code) {
        background: none;
        padding: 0;
    }
</style>

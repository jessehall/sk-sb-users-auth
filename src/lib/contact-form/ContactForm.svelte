<script>
    import { enhance } from "$app/forms";

    let { form } = $props();
    let isSubmitting = $state(false);

    const handleSubmit = () => {
        isSubmitting = true;
        return async ({ update }) => {
            await update();
            isSubmitting = false;
        };
    };
</script>

{#if form?.message}
    <div class="alert alert-error">
        {form.message}
    </div>
{/if}

<form method="POST" class="flex flex-col gap-4" use:enhance={handleSubmit}>
    <div>
        <label for="name" class="label">Name</label>
        <input
            id="name"
            name="name"
            type="text"
            required
            value={form?.values?.name ?? ""}
            class="input"
            aria-invalid={form?.errors?.name ? "true" : "false"}
            aria-describedby={form?.errors?.name ? "name-error" : undefined}
        />
        {#if form?.errors?.name}
            <p id="name-error" class="text-sm text-danger mt-1">{form.errors.name}</p>
        {/if}
    </div>

    <div>
        <label for="email" class="label">Email</label>
        <input
            id="email"
            name="email"
            type="email"
            required
            value={form?.values?.email ?? ""}
            class="input"
            aria-invalid={form?.errors?.email ? "true" : "false"}
            aria-describedby={form?.errors?.email ? "email-error" : undefined}
        />
        {#if form?.errors?.email}
            <p id="email-error" class="text-sm text-danger mt-1">{form.errors.email}</p>
        {/if}
    </div>

    <div>
        <label for="message" class="label">Message</label>
        <textarea
            id="message"
            name="message"
            rows="6"
            required
            class="input"
            aria-invalid={form?.errors?.message ? "true" : "false"}
            aria-describedby={form?.errors?.message
                ? "message-error"
                : undefined}>{form?.values?.message ?? ""}</textarea
        >
        {#if form?.errors?.message}
            <p id="message-error" class="text-sm text-danger mt-1">
                {form.errors.message}
            </p>
        {/if}
    </div>

    <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
        {#if isSubmitting}
            <span class="spinner"></span>
            Submitting...
        {:else}
            Send Message
        {/if}
    </button>
</form>

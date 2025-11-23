<script>
    import ContactForm from "$lib/contact-form/ContactForm.svelte";

    let { data, form } = $props();
</script>

<div
    class="container"
    style="padding-top: var(--space-8); padding-bottom: var(--space-8);"
>
    <div class="card" style="max-width: 600px; margin: 0 auto;">
        <h1 class="heading-1 text-center">Contact Us</h1>
        <ContactForm {form} />
    </div>
</div>

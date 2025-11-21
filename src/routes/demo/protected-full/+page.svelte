<script>
    export let data;
</script>

<div class="container">
    <h1 class="heading-1">Protected Page (Full)</h1>
    <div class="card">
        <p class="text-lg mb-4">Welcome back, {data.user?.email}!</p>
        <div class="alert alert-success">
            <strong>Secret:</strong>
            {data.secretMessage}
        </div>
        <p class="text-muted">
            This page is 100% blocked unless you are logged in.
        </p>
    </div>
</div>

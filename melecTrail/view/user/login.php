<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <title>Connexion</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous" />
    <link rel="stylesheet" href="/css/templatemo-style.css">

</head>

<body>
    <div class="tm-container-outer" id="tm-section-2">
        <section class="tm-innePage-section">
            <div class="tm-innePage tm-bg-gray">

                <div class="col-md-10 offset-md-1 p-1">

                    <h2>Connexion</h2>
                    <form id='login_form' action="/user/login" type="POST">
                        <div class="form-group">
                            <label for="username">username</label>
                            <input type="text" class="form-control" name="username" id="username" required />
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" name="password" id="password" required />
                        </div>
                        <button type='submit' class='btn btn-primary'>se connecter</button>
                    </form>
                </div>
        </section>
    </div>
    </div>

</body>

</html>
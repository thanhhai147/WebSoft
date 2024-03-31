from django.core.validators import RegexValidator

class AccountValidator:
    AccountName = RegexValidator(r'^[\w\d]+$')
    Password = RegexValidator(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$')

class ConsumerValidator:
    Phone = RegexValidator(r'(84|0[3|5|7|8|9])+([0-9]{8})\b')
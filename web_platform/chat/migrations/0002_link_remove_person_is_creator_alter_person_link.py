# Generated by Django 4.0.1 on 2022-01-23 09:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Link',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.URLField(null=True, verbose_name='URL to meet')),
            ],
        ),
        migrations.RemoveField(
            model_name='person',
            name='is_creator',
        ),
        migrations.AlterField(
            model_name='person',
            name='link',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='chat.link', verbose_name='link that was created by this user'),
        ),
    ]

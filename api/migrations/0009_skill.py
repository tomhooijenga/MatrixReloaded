# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-15 13:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_engineer'),
    ]

    operations = [
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level', models.SmallIntegerField()),
                ('engineer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='skills', to='api.Engineer')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='engineers', to='api.Product')),
            ],
        ),
    ]

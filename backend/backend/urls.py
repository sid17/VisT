from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^api/register/$', 'auth.views.register'),
    url(r'^api/login/$', 'auth.views.login'),
    url(r'^api/logout/$', 'auth.views.logout'),
    url(r'^api/process/$', 'auth.views.process'),
    url(r'^graph/getNode/$','graph.views.getNode'),
    url(r'^api/config/$','auth.views.setconfig'),
    url(r'^admin/', include(admin.site.urls)),
)

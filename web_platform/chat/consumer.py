from channels.consumer import SyncConsumer
from channels.generic.websocket import (
    AsyncWebsocketConsumer, JsonWebsocketConsumer,
    WebsocketConsumer
)
from channels.generic.http import AsyncHttpConsumer
import asyncio
from .models import Link

import json
from asgiref.sync import async_to_sync, sync_to_async


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        self.delete_link(self.room_name)

        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        receive_dict = json.loads(text_data)
        message = receive_dict.get('message', None)

        action = receive_dict['action']
        if action == 'new-offer' or action == 'new-answer':
            receiver_channel_name = receive_dict['message']['receiver_channel_name']
            receive_dict['message']['receiver_channel_name'] = self.channel_name
            await self.channel_layer.send(
                receiver_channel_name,
                {
                    'type': 'send.sdp',
                    'receive_dict': receive_dict,
                },
            )
        if message is not None:
            receive_dict['message']['receiver_channel_name'] = self.channel_name
            await self.channel_layer.group_send(
                self.room_name,
                {
                    'type': 'send.sdp',
                    'receive_dict': receive_dict,
                },
            )

    async def send_sdp(self, event):
        receive_dict = event['receive_dict']
        await self.send(text_data=json.dumps(receive_dict))

    @staticmethod
    @sync_to_async
    def delete_link(room_name):
        Link.objects.filter(title=room_name).delete()


class EchoConsumer(SyncConsumer):
    def websocket_connect(self, event):
        self.send({
            "type": "websocket.accept",
        })

    def websocket_receive(self, event):
        self.send({
            "type": "websocket.send",
            "text": event["text"],
        })


class JsonWebsocket(JsonWebsocketConsumer):
    def receive_json(self, content, **kwargs):
        self.send_json(content)


class BasicHttpConsumer(AsyncHttpConsumer):
    async def handle(self, body):
        await asyncio.sleep(10)
        await self.send_response(200, b"Your response bytes", headers=[
            (b"Content-Type", b"text/plain"),
        ])

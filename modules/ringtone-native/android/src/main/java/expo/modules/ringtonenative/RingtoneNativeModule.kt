package expo.modules.ringtonenative

import android.content.ContentValues
import android.content.Context
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.provider.ContactsContract
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class RingtoneNativeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("RingtoneNative")

    AsyncFunction("setRingtoneForContact") { contactId: String, ringtoneUri: String ->
      setRingtoneForContact(contactId, ringtoneUri)
    }

    AsyncFunction("setDefaultRingtone") { ringtoneUri: String ->
      setDefaultRingtone(ringtoneUri)
    }

    AsyncFunction("getRingtoneForContact") { contactId: String ->
      getRingtoneForContact(contactId)
    }

    AsyncFunction("isRingtonePermissionGranted") {
      isRingtonePermissionGranted()
    }

    AsyncFunction("requestRingtonePermission") {
      requestRingtonePermission()
    }
  }

  private val context: Context
    get() = requireNotNull(appContext.reactContext)

  private fun setRingtoneForContact(contactId: String, ringtoneUri: String): Boolean {
    return try {
      val uri = Uri.parse(ringtoneUri)
      val values = ContentValues().apply {
        put(ContactsContract.Contacts.CUSTOM_RINGTONE, uri.toString())
      }

      val contactUri = Uri.withAppendedPath(
        ContactsContract.Contacts.CONTENT_URI,
        contactId
      )

      val rowsUpdated = context.contentResolver.update(
        contactUri,
        values,
        null,
        null
      )

      rowsUpdated > 0
    } catch (e: Exception) {
      e.printStackTrace()
      false
    }
  }

  private fun setDefaultRingtone(ringtoneUri: String): Boolean {
    return try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        if (!Settings.System.canWrite(context)) {
          return false
        }
      }

      val uri = Uri.parse(ringtoneUri)
      RingtoneManager.setActualDefaultRingtoneUri(
        context,
        RingtoneManager.TYPE_RINGTONE,
        uri
      )
      true
    } catch (e: Exception) {
      e.printStackTrace()
      false
    }
  }

  private fun getRingtoneForContact(contactId: String): String? {
    return try {
      val projection = arrayOf(ContactsContract.Contacts.CUSTOM_RINGTONE)
      val contactUri = Uri.withAppendedPath(
        ContactsContract.Contacts.CONTENT_URI,
        contactId
      )

      context.contentResolver.query(
        contactUri,
        projection,
        null,
        null,
        null
      )?.use { cursor ->
        if (cursor.moveToFirst()) {
          val ringtoneIndex = cursor.getColumnIndex(ContactsContract.Contacts.CUSTOM_RINGTONE)
          if (ringtoneIndex >= 0) {
            cursor.getString(ringtoneIndex)
          } else null
        } else null
      }
    } catch (e: Exception) {
      e.printStackTrace()
      null
    }
  }

  private fun isRingtonePermissionGranted(): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      Settings.System.canWrite(context)
    } else {
      true
    }
  }

  private fun requestRingtonePermission(): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      Settings.System.canWrite(context)
    } else {
      true
    }
  }
}

#import "CDVFontScale.h"
#import <UIKit/UIKit.h>

// At Dynamic Type's default size ("Large") the body text style is 17pt, so the ratio to it is the user's text scale.
static const CGFloat kDefaultBodyPointSize = 17.0;

@implementation CDVFontScale

- (void)getFontScale:(CDVInvokedUrlCommand*)command
{
    UIFont* body = [UIFont preferredFontForTextStyle:UIFontTextStyleBody];
    double scale = body.pointSize / kDefaultBodyPointSize;
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:scale];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

@end

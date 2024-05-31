export const formatNoIntl = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
}